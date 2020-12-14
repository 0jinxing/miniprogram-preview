import Validator from 'async-validator';

const validator = new Validator({
  apiURL: { type: 'string', required: true },

  qrPath: { type: 'string', required: true },
  cliPath: { type: "string", required: true },
  projectPath: { type: 'string', required: true },
});

export function validate(cliPath?: string, projectPath?: string, qrPath?: string, apiURL?: string) {
  return validator.validate({ cliPath, projectPath, qrPath, apiURL });
}