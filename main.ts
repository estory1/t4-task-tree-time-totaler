import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

// Obsidian Plugin: Summation of Task-Level Time Estimates

export default class TaskTimeSummationPlugin extends Plugin {
  async onload() {
    console.log('Task Time Summation Plugin loaded');

    // Add a button to the ribbon
    this.addRibbonIcon('square-sigma', 'Update Task Time Sums', (evt: MouseEvent) => {
      const activeLeaf = this.app.workspace.activeLeaf;
      if (activeLeaf && activeLeaf.view.getViewType() === 'markdown') {
        const editor = (activeLeaf.view as any).sourceMode.cmEditor;
        if (editor) {
          new Notice('Updating task time estimates...');
          const content = editor.getValue();
          const updatedContent = this.updateTimeEstimates(content);
          editor.setValue(updatedContent);
        } else {
          new Notice('No active editor found.');
        }
      } else {
        new Notice('Please focus on a Markdown editor.');
      }
    });
  }

  onunload() {
    console.log('Task Time Summation Plugin unloaded');
  }

  updateTimeEstimates(content: string): string {
    const lines = content.split('\n');
    const stack: { level: number; time: number; unit?: string }[] = [];

    function convertToMinutes(time: number, unit: string | undefined): number {
      if (!unit) return time;
      switch (unit) {
        case 'D': return time * 60 * 24 * 365 * 10; // Assuming a decade as 10 years
        case 'Y': return time * 525600;
        case 'M': return time * 43200; // Assuming an average month of 30 days
        case 'w': return time * 10080;
        case 'd': return time * 1440;
        case 'h': return time * 60;
        case 'bd': return time * 480; // Business day: 8 hours
        case 'bw': return time * 2400; // Business week: 5 days
        case 'm': return time;
        default: return time;
      }
    }

    function convertFromMinutes(timeInMinutes: number, unit: string | undefined): string {
      if (!unit) return `${timeInMinutes}`; // Use the raw number for minutes
      let time = timeInMinutes;
      switch (unit) {
        case 'D':
          return `${(time / (60 * 24 * 365 * 10)).toFixed(1)}D`; // Assuming a decade as 10 years
        case 'Y':
          return `${(time / 525600).toFixed(1)}Y`;
        case 'M':
          return `${(time / 43200).toFixed(1)}M`; // Assuming an average month of 30 days
        case 'w':
          return `${(time / 10080).toFixed(1)}w`;
        case 'd':
          return `${(time / 1440).toFixed(1)}d`;
        case 'h':
          return `${(time / 60).toFixed(1)}h`;
        case 'bd':
          return `${(time / 480).toFixed(1)}bd`; // Business day
        case 'bw':
          return `${(time / 2400).toFixed(1)}bw`; // Business week
        case 'm':
          return `${time}m`;
        default:
          return `${time}`; // Unknown unit
      }
    }

    for (let i = lines.length - 1; i >= 0; i--) {
      const line = lines[i];
      const match = line.match(/^(\s*)- \[.\] (\[\]|\[([\d\.]+)(\w*)\])/);

      if (match) {
        const indent = match[1].length;
        let currentTimeInMinutes = 0;
        let unit: string | undefined; // Default to undefined for no unit
        // Parse current time estimate if present
        if (match[2].startsWith('[') && match[3]) {
          currentTimeInMinutes = convertToMinutes(parseFloat(match[3]), match[4]);
          unit = match[4];
        }

        // Recompute time by summing subtasks
        let totalTimeInMinutes = 0;
        while (stack.length > 0 && stack[stack.length - 1].level > indent) {
          const subtask = stack.pop()!;
          totalTimeInMinutes += subtask.time;

          // Determine the coarsest unit to use for the sum
          if (subtask.unit === 'D' || unit === 'D') {
            unit = 'D';
          } else if (subtask.unit === 'Y' || unit === 'Y') {
            unit = 'Y';
          } else if (subtask.unit === 'M' || unit === 'M') {
            unit = 'M';
          } else if (subtask.unit === 'w' || unit === 'w') {
            unit = 'w';
          } else if (subtask.unit === 'd' || unit === 'd') {
            unit = 'd';
          } else if (subtask.unit === 'h' || unit === 'h') {
            unit = 'h';
          } else if (subtask.unit === 'bw' || unit === 'bw') {
            unit = 'bw';
          } else if (subtask.unit === 'bd' || unit === 'bd') {
            unit = 'bd';
          }
        }

        // If no subtasks contribute, use the current task's own estimate
        totalTimeInMinutes = totalTimeInMinutes > 0 ? totalTimeInMinutes : currentTimeInMinutes;

        // Update line with the new total time and unit
        if (match[2] === '[]') {
          lines[i] = line.replace(/\[\]/, `[${convertFromMinutes(totalTimeInMinutes, unit)}]`);
        } else {
          lines[i] = line.replace(/\[([\d\.]+)(\w*)\]/, `[${convertFromMinutes(totalTimeInMinutes, unit)}]`);
        }

        // Push the updated total time for this task onto the stack
        stack.push({ level: indent, time: totalTimeInMinutes, unit });
      }
    }

    return lines.join('\n');
  }
}
