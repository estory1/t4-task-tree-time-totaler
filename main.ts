import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

// Obsidian Plugin: Summation of Task-Level Time Estimates

export default class TaskTimeSummationPlugin extends Plugin {
  async onload() {
    console.log('Task Time Summation Plugin loaded');

    // Add a button to the ribbon
    this.addRibbonIcon('calculator', 'Update Task Time Sums', (evt: MouseEvent) => {
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
    const stack: { level: number; time: number; lineIndex: number }[] = [];

    for (let i = lines.length - 1; i >= 0; i--) {
      const line = lines[i];
      const match = line.match(/^(\s*)- \[.\] (\[\]|\[([\d\.]+)h\])/);

      if (match) {
        const indent = match[1].length;
        let currentTime = 0;

        // Parse current time estimate if present
        if (match[2].startsWith('[') && match[3]) {
          currentTime = parseFloat(match[3]);
        }

        // Recompute time by summing subtasks
        let totalTime = 0;
        while (stack.length > 0 && stack[stack.length - 1].level > indent) {
          totalTime += stack.pop()!.time;
        }

        // If no subtasks contribute, use the current task's own estimate
        totalTime = totalTime > 0 ? totalTime : currentTime;

        // Update line with the new total time
        if (match[2] === '[]') {
          lines[i] = line.replace(/\[\]/, `[${totalTime}h]`);
        } else {
          lines[i] = line.replace(/\[([\d\.]+)h\]/, `[${totalTime}h]`);
        }

        // Push the updated total time for this task onto the stack
        stack.push({ level: indent, time: totalTime, lineIndex: i });
      }
    }

    return lines.join('\n');
  }
}
