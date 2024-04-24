import pdf from "pdf-creator-node";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { options } from "./options.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const createPdf = (users, fileName, req, res) => {
  const htmlPath = join(__dirname, "../../templates/pdf.html");
  const html = fs.readFileSync(htmlPath, "utf8");
  var document = {
    html: html,
    data: { users },
    path: `./${fileName}`,
  };
  pdf.create(document, options).then(() => {
    if (res) {
      return res.json(
        `<a download href="${req.protocol}://${req.headers.host}/userPdf/${fileName}">download</a>`
      );
    }
  });
};
