import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default'
}

// export default class HelloWorldPlugin extends Plugin {
// 	settings: MyPluginSettings;

// 	async onload() {
// 		await this.loadSettings();

// 		this.addRibbonIcon('dice', 'Greet', () => {
// 			new Notice('Hello, world!');
// 		  });
		
// 		// This creates an icon in the left ribbon.
// 		const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
// 			// Called when the user clicks the icon.
// 			new Notice('This is a notice!');
// 		});
// 		// Perform additional things with the ribbon
// 		ribbonIconEl.addClass('my-plugin-ribbon-class');

// 		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
// 		const statusBarItemEl = this.addStatusBarItem();
// 		statusBarItemEl.setText('Status Bar Text');

// 		// This adds a simple command that can be triggered anywhere
// 		this.addCommand({
// 			id: 'open-sample-modal-simple',
// 			name: 'Open sample modal (simple)',
// 			callback: () => {
// 				new SampleModal(this.app).open();
// 			}
// 		});
// 		// This adds an editor command that can perform some operation on the current editor instance
// 		this.addCommand({
// 			id: 'sample-editor-command',
// 			name: 'Sample editor command',
// 			editorCallback: (editor: Editor, view: MarkdownView) => {
// 				console.log(editor.getSelection());
// 				editor.replaceSelection('Sample Editor Command');
// 			}
// 		});
// 		// This adds a complex command that can check whether the current state of the app allows execution of the command
// 		this.addCommand({
// 			id: 'open-sample-modal-complex',
// 			name: 'Open sample modal (complex)',
// 			checkCallback: (checking: boolean) => {
// 				// Conditions to check
// 				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
// 				if (markdownView) {
// 					// If checking is true, we're simply "checking" if the command can be run.
// 					// If checking is false, then we want to actually perform the operation.
// 					if (!checking) {
// 						new SampleModal(this.app).open();
// 					}

// 					// This command will only show up in Command Palette when the check function returns true
// 					return true;
// 				}
// 			}
// 		});

// 		// This adds a settings tab so the user can configure various aspects of the plugin
// 		this.addSettingTab(new SampleSettingTab(this.app, this));

// 		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
// 		// Using this function will automatically remove the event listener when this plugin is disabled.
// 		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
// 			console.log('click', evt);
// 		});

// 		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
// 		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
// 	}

// 	onunload() {

// 	}

// 	async loadSettings() {
// 		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
// 	}

// 	async saveSettings() {
// 		await this.saveData(this.settings);
// 	}


// 	type Task = {
// 		line: string;
// 		duration: number | null; // Duration in hours or null if not specified
// 		children: Task[];
// 	};

// 	function parseMarkdownTasks(lines: string[]): Task[] {
// 		const rootTasks: Task[] = [];
// 		let currentParent: Task | null = null;

// 		lines.forEach(line => {
// 			const taskMatch = line.match(/^\s*\-\s*\[([ x])\]\s*(\[\d+h\])?\s*(.*)$/);
			
// 			if (taskMatch) {
// 				const [, , durationStr, description] = taskMatch;
// 				const duration = durationStr ? parseInt(durationStr.slice(1, -1)) : null;

// 				const newTask: Task = { line, duration, children: [] };

// 				if (!currentParent || description.trim().length === 0) {
// 					// This is a top-level task
// 					rootTasks.push(newTask);
// 					currentParent = newTask;
// 				} else {
// 					// This is a subtask
// 					currentParent.children.push(newTask);
// 				}
// 			} else if (line.startsWith(' ')) {
// 				// Indented line, assume it's part of the current task's description
// 				if (currentParent) {
// 					const updatedLine = `${currentParent.line}\n${line}`;
// 					currentParent.line = updatedLine;
// 				}
// 			}
// 		});

// 		return rootTasks;
// 	}

// 	function calculateDurations(task: Task): number {
// 		let totalDuration = task.duration || 0;

// 		for (const child of task.children) {
// 			totalDuration += calculateDurations(child);
// 		}

// 		// Update the current task's line with the calculated duration if it had no initial estimate
// 		if (!task.duration) {
// 			const updatedLine = task.line.replace(/(\[\d+h\])/, `[${totalDuration}h]`);
// 			task.line = updatedLine;
// 		}

// 		return totalDuration;
// 	}

// 	function processMarkdownDocument(content: string): string {
// 		const lines = content.split('\n');
// 		const tasks = parseMarkdownTasks(lines);

// 		for (const task of tasks) {
// 			calculateDurations(task);
// 		}

// 		// Reconstruct the document
// 		return tasks.map(task => renderTask(task, 0)).join('\n');
// 	}

// 	function renderTask(task: Task, indentLevel: number): string {
// 		let result = ' '.repeat(indentLevel * 2) + task.line;

// 		for (const child of task.children) {
// 			result += '\n' + renderTask(child, indentLevel + 1);
// 		}

// 		return result;
// 	}

// 	// Example usage
// 	const markdownContent = `
// 	- [ ] [6h] Build a fin RAG + Llama3-based competitor to [About: AI Equity Research Copilot](https://fintool.com/about)
// 	- [langgraph/examples/tutorials/rag-agent-testing-local.ipynb at main · langchain-ai/langgraph](https://github.com/langchain-ai/langgraph/blob/main/examples/tutorials/rag-agent-testing-local.ipynb) via [Fully local RAG agents with Llama 3.1 - YouTube](https://www.youtube.com/watch?v=nPpgh_KaNng)
// 	- [ ] [4h] (4.67h) Ingest SEC filings data, compute distances.
// 	- [x] [2h] ([4.67h](https://track.toggl.com/reports/detailed/992001/description/sw%2Fdata/from/2025-01-16/tags/14436521/to/2025-01-31)) (Added 20250116.) Read SEC 10-K files.
// 	- [ ] [1h] (0h) Convert docs.
// 	- [ ] [1h] (0h) Get, setup RAG DB.
// 	- [ ] [1h] (0h) Integrate w/ a local LLM.
// 	- [ ] [1h] (0h) Fix issues.
// 	`;

// 	const updatedMarkdown = processMarkdownDocument(markdownContent);
// 	console.log(updatedMarkdown);
// }

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}

// ChatGPT-4o's v1
//
// // Obsidian Plugin: Summation of Task-Level Time Estimates
// // import { Plugin } from 'obsidian';

// export default class TaskTimeSummationPlugin extends Plugin {
//   async onload() {
//     console.log('Task Time Summation Plugin loaded');

//     this.addCommand({
//       id: 'update-task-time-sums',
//       name: 'Update Task Time Sums',
//       editorCallback: (editor) => {
//         const content = editor.getValue();
//         const updatedContent = this.updateTimeEstimates(content);
//         editor.setValue(updatedContent);
//       },
//     });
//   }

//   onunload() {
//     console.log('Task Time Summation Plugin unloaded');
//   }

//   updateTimeEstimates(content: string): string {
//     const lines = content.split('\n');
//     const stack: { level: number; time: number; lineIndex: number }[] = [];

//     for (let i = lines.length - 1; i >= 0; i--) {
//       const line = lines[i];
//       const match = line.match(/^(\s*)- \[.\] \[(\d+)h\]/);

//       if (match) {
//         const indent = match[1].length;
//         const currentTime = parseInt(match[2], 10);
//         let totalTime = currentTime;

//         while (stack.length > 0 && stack[stack.length - 1].level > indent) {
//           totalTime += stack.pop()!.time;
//         }

//         lines[i] = line.replace(/\[(\d+)h\]/, `[${totalTime}h]`);

//         stack.push({ level: indent, time: totalTime, lineIndex: i });
//       }
//     }

//     return lines.join('\n');
//   }
// }

// // ChatGPT-4o's V2.
// // Obsidian Plugin: Summation of Task-Level Time Estimates
// import { Plugin, WorkspaceLeaf } from 'obsidian';

// export default class TaskTimeSummationPlugin extends Plugin {

//   async onload() {

//     console.log('Task Time Summation Plugin loaded');

//     // Add a button to the ribbon
//     this.addRibbonIcon('calculator', 'Update Task Time Sums', (evt: MouseEvent) => {
//       const activeLeaf = this.app.workspace.activeLeaf;
//       if (activeLeaf && activeLeaf.view.getViewType() === 'markdown') {
//         const editor = (activeLeaf.view as any).sourceMode.cmEditor;
//         if (editor) {
// 			new Notice('Editing...');
//           const content = editor.getValue();
//           const updatedContent = this.updateTimeEstimates(content);
//           editor.setValue(updatedContent);
//         } else {
//           new Notice('No active editor found.');
//         }
//       } else {
//         new Notice('Please focus on a Markdown editor.');
//       }
//     });
//   }

//   onunload() {
//     console.log('Task Time Summation Plugin unloaded');
//   }

//   updateTimeEstimates(content: string): string {
//     const lines = content.split('\n');
//     const stack: { level: number; time: number; lineIndex: number }[] = [];

//     for (let i = lines.length - 1; i >= 0; i--) {
//       const line = lines[i];
//       const match = line.match(/^(\s*)- \[.\] \[(\d+)h\]/);

//       if (match) {
//         const indent = match[1].length;
//         const currentTime = parseInt(match[2], 10);
//         let totalTime = currentTime;

//         while (stack.length > 0 && stack[stack.length - 1].level > indent) {
//           totalTime += stack.pop()!.time;
//         }

//         lines[i] = line.replace(/\[(\d+)h\]/, `[${totalTime}h]`);

//         stack.push({ level: indent, time: totalTime, lineIndex: i });
//       }
//     }

//     return lines.join('\n');
//   }
// }


// v3
// // Obsidian Plugin: Summation of Task-Level Time Estimates
// import { Plugin, WorkspaceLeaf, Notice } from 'obsidian';

// export default class TaskTimeSummationPlugin extends Plugin {
//   async onload() {
//     console.log('Task Time Summation Plugin loaded');

//     // Add a button to the ribbon
//     this.addRibbonIcon('calculator', 'Update Task Time Sums', (evt: MouseEvent) => {
//       const activeLeaf = this.app.workspace.activeLeaf;
//       if (activeLeaf && activeLeaf.view.getViewType() === 'markdown') {
//         const editor = (activeLeaf.view as any).sourceMode.cmEditor;
//         if (editor) {
//           new Notice('Updating task time estimates...');
//           const content = editor.getValue();
//           const updatedContent = this.updateTimeEstimates(content);
//           editor.setValue(updatedContent);
//         } else {
//           new Notice('No active editor found.');
//         }
//       } else {
//         new Notice('Please focus on a Markdown editor.');
//       }
//     });
//   }

//   onunload() {
//     console.log('Task Time Summation Plugin unloaded');
//   }

//   updateTimeEstimates(content: string): string {
//     const lines = content.split('\n');
//     const stack: { level: number; time: number; lineIndex: number }[] = [];

//     for (let i = lines.length - 1; i >= 0; i--) {
//       const line = lines[i];
//       const match = line.match(/^(\\s*)- \[.\] (\[\]|\[(\d+)h\])/);

// 	  console.log("\t" + line + "\n\t" + match);
//       if (match) {
//         const indent = match[1].length;
//         const currentTime = match[3] ? parseInt(match[3], 10) : 0;
//         let totalTime = currentTime;

//         while (stack.length > 0 && stack[stack.length - 1].level > indent) {
//           totalTime += stack.pop()!.time;
//         }

//         lines[i] = line.replace(/\[.*?h\]/, `[${totalTime}h]`).replace(/\[\]/, `[${totalTime}h]`);

//         stack.push({ level: indent, time: totalTime, lineIndex: i });
//       }
//     }

//     return lines.join('\n');
//   }
// }


// // v4
// // Obsidian Plugin: Summation of Task-Level Time Estimates
// import { Plugin, WorkspaceLeaf, Notice } from 'obsidian';

// export default class TaskTimeSummationPlugin extends Plugin {
//   async onload() {
//     console.log('Task Time Summation Plugin loaded');

//     // Add a button to the ribbon
//     this.addRibbonIcon('calculator', 'Update Task Time Sums', (evt: MouseEvent) => {
//       const activeLeaf = this.app.workspace.activeLeaf;
//       if (activeLeaf && activeLeaf.view.getViewType() === 'markdown') {
//         const editor = (activeLeaf.view as any).sourceMode.cmEditor;
//         if (editor) {
//           new Notice('Updating task time estimates...');
//           const content = editor.getValue();
//           const updatedContent = this.updateTimeEstimates(content);
//           editor.setValue(updatedContent);
//         } else {
//           new Notice('No active editor found.');
//         }
//       } else {
//         new Notice('Please focus on a Markdown editor.');
//       }
//     });
//   }

//   onunload() {
//     console.log('Task Time Summation Plugin unloaded');
//   }

//   updateTimeEstimates(content: string): string {
//     const lines = content.split('\n');
//     const stack: { level: number; time: number; lineIndex: number }[] = [];

//     for (let i = lines.length - 1; i >= 0; i--) {
//       const line = lines[i];
//       const match = line.match(/^(\s*)- \[.\] (\[.*?\]|\[(\d+)h\])/);

//       if (match) {
//         const indent = match[1].length;
//         const currentTime = match[3] ? parseInt(match[3], 10) : 0;
//         let totalTime = currentTime;

//         while (stack.length > 0 && stack[stack.length - 1].level > indent) {
//           totalTime += stack.pop()!.time;
//         }

//         lines[i] = line.replace(/\[.*?h\]/, `[${totalTime}h]`).replace(/\[.*?\]/, `[${totalTime}h]`);

//         stack.push({ level: indent, time: totalTime, lineIndex: i });
//       }
//     }

//     return lines.join('\n');
//   }
// }


// // v5
// // Obsidian Plugin: Summation of Task-Level Time Estimates
// import { Plugin, WorkspaceLeaf, Notice } from 'obsidian';

// export default class TaskTimeSummationPlugin extends Plugin {
//   async onload() {
//     console.log('Task Time Summation Plugin loaded');

//     // Add a button to the ribbon
//     this.addRibbonIcon('calculator', 'Update Task Time Sums', (evt: MouseEvent) => {
//       const activeLeaf = this.app.workspace.activeLeaf;
//       if (activeLeaf && activeLeaf.view.getViewType() === 'markdown') {
//         const editor = (activeLeaf.view as any).sourceMode.cmEditor;
//         if (editor) {
//           new Notice('Updating task time estimates...');
//           const content = editor.getValue();
//           const updatedContent = this.updateTimeEstimates(content);
//           editor.setValue(updatedContent);
//         } else {
//           new Notice('No active editor found.');
//         }
//       } else {
//         new Notice('Please focus on a Markdown editor.');
//       }
//     });
//   }

//   onunload() {
//     console.log('Task Time Summation Plugin unloaded');
//   }

//   updateTimeEstimates(content: string): string {
//     const lines = content.split('\n');
//     const stack: { level: number; time: number; lineIndex: number }[] = [];

//     for (let i = lines.length - 1; i >= 0; i--) {
//       const line = lines[i];
//       const match = line.match(/^(\s*)- \[.\] (\[\]|\[(\d+)h\])/);

//       if (match) {
//         const indent = match[1].length;
//         const currentTime = match[3] ? parseInt(match[3], 10) : 0;
//         let totalTime = currentTime;

//         while (stack.length > 0 && stack[stack.length - 1].level > indent) {
//           totalTime += stack.pop()!.time;
//         }

//         if (match[2] === '[]') {
//           lines[i] = line.replace(/\[\]/, `[${totalTime}h]`);
//         } else {
//           lines[i] = line.replace(/\[(\d+)h\]/, `[${totalTime}h]`);
//         }

//         stack.push({ level: indent, time: totalTime, lineIndex: i });
//       }
//     }

//     return lines.join('\n');
//   }
// }


// // v6
// // Obsidian Plugin: Summation of Task-Level Time Estimates
// import { Plugin, WorkspaceLeaf, Notice } from 'obsidian';

// export default class TaskTimeSummationPlugin extends Plugin {
//   async onload() {
//     console.log('Task Time Summation Plugin loaded');

//     // Add a button to the ribbon
//     this.addRibbonIcon('calculator', 'Update Task Time Sums', (evt: MouseEvent) => {
//       const activeLeaf = this.app.workspace.activeLeaf;
//       if (activeLeaf && activeLeaf.view.getViewType() === 'markdown') {
//         const editor = (activeLeaf.view as any).sourceMode.cmEditor;
//         if (editor) {
//           new Notice('Updating task time estimates...');
//           const content = editor.getValue();
//           const updatedContent = this.updateTimeEstimates(content);
//           editor.setValue(updatedContent);
//         } else {
//           new Notice('No active editor found.');
//         }
//       } else {
//         new Notice('Please focus on a Markdown editor.');
//       }
//     });
//   }

//   onunload() {
//     console.log('Task Time Summation Plugin unloaded');
//   }

//   updateTimeEstimates(content: string): string {
//     const lines = content.split('\n');
//     const stack: { level: number; time: number; lineIndex: number }[] = [];

//     for (let i = lines.length - 1; i >= 0; i--) {
//       const line = lines[i];
//       const match = line.match(/^(\s*)- \[.\] (\[\]|\[(\d+)h\])/);

//       if (match) {
//         const indent = match[1].length;

//         // Always recompute time from subtasks, ignoring current value
//         let totalTime = 0;
//         while (stack.length > 0 && stack[stack.length - 1].level > indent) {
//           totalTime += stack.pop()!.time;
//         }

//         // Update line with the new total time
//         if (match[2] === '[]') {
//           lines[i] = line.replace(/\[\]/, `[${totalTime}h]`);
//         } else {
//           lines[i] = line.replace(/\[(\d+)h\]/, `[${totalTime}h]`);
//         }

//         // Push the updated total time for this task onto the stack
//         stack.push({ level: indent, time: totalTime, lineIndex: i });
//       }
//     }

//     return lines.join('\n');
//   }
// }


// v7
// Obsidian Plugin: Summation of Task-Level Time Estimates
import { Plugin, WorkspaceLeaf, Notice } from 'obsidian';

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
      const match = line.match(/^(\s*)- \[.\] (\[\]|\[(\d+)h\])/);

      if (match) {
        const indent = match[1].length;
        let currentTime = 0;

        // Parse current time estimate if present
        if (match[2].startsWith('[') && match[3]) {
          currentTime = parseInt(match[3], 10);
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
          lines[i] = line.replace(/\[(\d+)h\]/, `[${totalTime}h]`);
        }

        // Push the updated total time for this task onto the stack
        stack.push({ level: indent, time: totalTime, lineIndex: i });
      }
    }

    return lines.join('\n');
  }
}
