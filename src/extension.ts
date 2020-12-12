import * as vscode from "vscode";
import * as path from 'path';
import { spawnSync } from 'child_process';

const EXTENSION_NAME = 'miniprogram-preview';
const CLI_CONF = "miniprogram.cli";
const STATUS_BAR_COMMAN = `${EXTENSION_NAME}.generate-qrcode`;

export function activate(context: vscode.ExtensionContext) {
	let cli: string = vscode.workspace.getConfiguration().get(CLI_CONF) || '';

	const commandDisposable = vscode.commands.registerCommand(STATUS_BAR_COMMAN, () => {
		const rootPath = vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].uri.fsPath : '';

		if (!cli) {
			vscode.window.showErrorMessage("请选配置 小程序 CLI 路径");
			return;
		}

		if (!rootPath) {
			vscode.window.showErrorMessage("请选打开 小程序项目");
			return;
		}

		const storagePath = context.storageUri?.fsPath;
		if (!storagePath) {
			vscode.window.showErrorMessage("获取临时目录失败");
			return;
		}

		const imagePath = path.resolve(storagePath, 'qr.jpg');

		debugger;
		vscode.window.withProgress({ location: vscode.ProgressLocation.Notification, title: '预览二维码生成中', cancellable: false }, (process) => {
			return new Promise(resolve => {
				const result = spawnSync('cmd.exe', ['/c', cli, 'preview', '--project', rootPath, '-f', 'image', '-o', "C:\\Users\\Lin\\Desktop\\qr.jpg"]);

				const err = result.stderr.toString();
				const out = result.stdout.toString();

				process.report({ increment: 30 });
			})
		})
	});
	context.subscriptions.push(commandDisposable);

	const confDisposable = vscode.workspace.onDidChangeConfiguration(e => {
		if (e.affectsConfiguration(CLI_CONF)) {
			cli = vscode.workspace.getConfiguration().get<string>(CLI_CONF) || '';
		}
	});
	context.subscriptions.push(confDisposable);
}

export function deactivate() { }
