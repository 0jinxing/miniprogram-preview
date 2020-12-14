import * as vscode from "vscode";
import * as path from 'path';
import { tmpdir } from 'os';
import { validate } from './utils/validate';
import { genQR } from "./utils/gen-qr";
import { putQR } from "./utils/put-qr";

const EXTENSION_NAME = 'miniprogram-preview';
const CLI_CONF = "miniprogram.cli";
const API_CONF = 'miniprogram.url';
const STATUS_BAR_COMMAN = `${EXTENSION_NAME}.generate-qrcode`;

const QR_CODE = `${EXTENSION_NAME}.qr.jpg`;

export function activate(context: vscode.ExtensionContext) {
	let cliPath = vscode.workspace.getConfiguration().get<string>(CLI_CONF) || '';
	let apiURL = vscode.workspace.getConfiguration().get<string>(API_CONF) || '';

	const commandDisposable = vscode.commands.registerCommand(STATUS_BAR_COMMAN, async () => {
		const projectPath = vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].uri.fsPath : '';
		const outPath = path.resolve(tmpdir(), QR_CODE);

		try {
			await validate(cliPath, projectPath, outPath, apiURL);

			vscode.window.withProgress({ location: vscode.ProgressLocation.Notification, title: '预览二维码生成中', cancellable: false }, async (process) => {
				try {
					await genQR(cliPath, projectPath, outPath);
					await putQR(outPath, apiURL);

					const panel = vscode.window.createWebviewPanel("QR", "QR Code", vscode.ViewColumn.One, {
						localResourceRoots: [vscode.Uri.file(tmpdir())]
					});

					const url = panel.webview.asWebviewUri(vscode.Uri.file(outPath));

					panel.webview.html = `<img src="${url}" width="300" />`;
				} catch (err) {
					vscode.window.showErrorMessage(err.message);
				}
			})
		} catch (err) {
			vscode.window.showErrorMessage(err.message);
		}
	});

	context.subscriptions.push(commandDisposable);

	const confDisposable = vscode.workspace.onDidChangeConfiguration(e => {
		if (e.affectsConfiguration(CLI_CONF)) {
			cliPath = vscode.workspace.getConfiguration().get<string>(CLI_CONF) || '';
		}
		
		if (e.affectsConfiguration(API_CONF)) {
			apiURL = vscode.workspace.getConfiguration().get<string>(API_CONF) || '';
		}
	});

	context.subscriptions.push(confDisposable);
}

export function deactivate() { }
