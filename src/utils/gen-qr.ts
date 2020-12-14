import { execFile } from 'child_process';

export function genQR(cliPath: string, projectPath: string, outPath: string) {
  return new Promise((resolve, reject) => {
    execFile(cliPath, ['preview', '--project', projectPath, '-f', 'image', '-o', outPath], (err, stdout, stderr) => {
      if (err) return reject(err);
      resolve({ stdout, stderr });
    });
  })

}