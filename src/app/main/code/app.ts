/* eslint-disable no-console */

/**
 * This script should be run after modifying codes.json
 * It regenerates the library, and updates the table in README.md
 */

import {
  EnumMemberStructure,
  OptionalKind,
  Project,
  StructureKind,
  VariableDeclarationKind,
  Writers,
} from "../../../deps/dev.ts";
import { markdownTable } from "../../../deps/dev.ts";
import { JsonCode } from "./models.ts";
import { currentModuleDir, logger } from "./utils.ts";

Deno.chdir(currentModuleDir(import.meta.url));

const codes: JsonCode[] = JSON.parse(
  await Deno.readTextFile("../assets/codes.json"),
);

logger.info("Updating library.");
const project = new Project();

logger.info("\t=> Creating code members.");
const reasonPhraseMembers: OptionalKind<EnumMemberStructure>[] = codes
  .map(({
    phrase,
    constant,
    comment,
    isDeprecated,
  }: JsonCode) => {
    const { doc, description } = comment;
    const deprecatedString = isDeprecated ? "@deprecated\n" : "";
    return {
      name: constant,
      value: phrase,
      docs: [`${deprecatedString}${doc}\n\n${description}`],
    };
  });

const statusCodeMembers: OptionalKind<EnumMemberStructure>[] = codes
  .map(({
    code,
    constant,
    comment,
    isDeprecated,
  }: JsonCode) => {
    const { doc, description } = comment;
    const deprecatedString = isDeprecated ? "@deprecated\n" : "";
    return {
      name: constant,
      value: code,
      docs: [`${deprecatedString}${doc}\n\n${description}`],
    };
  });

const statusCodeToReasonPhrase = codes
  .reduce((acc: Record<string, string>, { code, phrase }) => {
    (acc as Record<string, string>)[`"${code.toString()}"`] = `"${phrase}"`;
    return acc;
  }, {});

const reasonPhraseToStatusCode = codes
  .reduce((acc: Record<string, number>, { code, phrase }) => {
    (acc as Record<string, number>)[`"${phrase}"`] = code;
    return acc;
  }, {});

logger.info("\t=> Creating source file objects.");
const libDir = "../../../lib/main/code/";
const statusCodeFile = project.createSourceFile(
  libDir.concat("status-codes.ts"),
  {
    statements: [{
      kind: StructureKind.Enum,
      name: "StatusCodes",
      isExported: true,
      members: statusCodeMembers,
    }],
  },
  {
    overwrite: true,
  },
);

const reasonPhraseFile = project.createSourceFile(
  libDir.concat("reason-phrases.ts"),
  {
    statements: [
      {
        kind: StructureKind.Enum,
        name: "ReasonPhrases",
        isExported: true,
        members: reasonPhraseMembers,
      },
    ],
  },
  {
    overwrite: true,
  },
);

const recordsFile = project.createSourceFile(
  libDir.concat("records.ts"),
  {
    statements: [{
      kind: StructureKind.VariableStatement,
      isExported: true,
      declarationKind: VariableDeclarationKind.Const,
      declarations: [{
        name: "statusCodeToReasonPhrase",
        type: "Record<string, string>",
        initializer: Writers.object(statusCodeToReasonPhrase),
      }],
    }, {
      kind: StructureKind.VariableStatement,
      isExported: true,
      declarationKind: VariableDeclarationKind.Const,
      declarations: [{
        name: "reasonPhraseToStatusCode",
        type: "Record<string, number>",
        initializer: Writers.object(reasonPhraseToStatusCode),
      }],
    }],
  },
  {
    overwrite: true,
  },
);

[statusCodeFile, reasonPhraseFile, recordsFile].forEach((sf) => {
  sf.insertStatements(0, "// Generated file. Do not edit\n");
});

logger.info("\t=> Writing source files.");
await project.save();
logger.info("Successfully updated library.");

logger.info("Updating README.md table");
const readmeUri = "../../../../README.md";
let readmeFile = await Deno.readTextFile(readmeUri);
const sortedCodes = codes.sort((
  a: JsonCode,
  b: JsonCode,
) => (a.code - b.code));

logger.info("\t=> Creating new table.");
const table = markdownTable([
  ["Code", "Constant", "Reason Phrase"],
  ...sortedCodes.map((
    code: JsonCode,
  ) => [code.code.toString(), code.constant, code.phrase]),
]);

logger.info("\t=> Replacing old table.");
const readmeRegex = /## Codes\n\n([^#]*)##/g;
readmeFile = readmeFile.replace(readmeRegex, `## Codes\n\n${table}\n\n##`);

Deno.writeTextFile(readmeUri, readmeFile);
logger.info("Successfully updated README.md table");
