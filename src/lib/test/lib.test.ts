import { Rhum } from "../../deps/dev.ts";
//---------------------------------------------------
import { IJsonCode } from "../../app/main/models/json-code.ts";
import { StatusCodes } from "../main/status-codes.ts";
import { ReasonPhrases } from "../main/reason-phrases.ts";
import { getReasonPhrase, getStatusCode } from "../main/utils/functions.ts";
import { currentModuleDir } from "../../app/main/utils/functions/current-module-dir.ts";
import { GenericErrMessages } from "../main/utils/constants.ts";

Deno.chdir(currentModuleDir(import.meta.url));

const { assertEquals, assertThrows } = Rhum.asserts;

Rhum.testPlan("lib tests", () => {
  let codes: IJsonCode[];

  Rhum.beforeAll(async () => {
    codes = JSON.parse(
      await Deno.readTextFile(
        "../../app/main/resources/codes.json",
      ),
    );
  });

  Rhum.testSuite("StatusCodes", () => {
    Rhum.testCase("all there", () => {
      // Divide by two because TypeScript enums contain both key and value
      // when values are Number types
      assertEquals(Object.keys(StatusCodes).length / 2, codes.length);
      codes.forEach((o) => {
        assertEquals((<any> StatusCodes)[o.constant], o.code as number);
      });
    });
  });

  Rhum.testSuite("getStatusCode(reasonPhrase: string): number", () => {
    Rhum.testCase("throw err for nonexistent reason phrase", () => {
      const reasonPhrase = "blah blah";
      assertThrows(
        () => getStatusCode(reasonPhrase),
        Error,
        GenericErrMessages.REASON_PHRASE_DOES_NOT_EXIST(reasonPhrase),
      );
    });

    Rhum.testCase("happy path", () => {
      codes.forEach((o) => {
        assertEquals(getStatusCode(o.phrase), o.code);
      });
    });
  });

  Rhum.testSuite("ReasonPhrases", () => {
    Rhum.testCase("all there", () => {
      assertEquals(Object.keys(ReasonPhrases).length, codes.length);
      codes.forEach((o) => {
        assertEquals((<any> ReasonPhrases)[o.constant], o.phrase);
      });
    });
  });

  Rhum.testSuite(
    "getReasonPhrase(statusCode: (string | number)): string",
    () => {
      Rhum.testCase("throw err for nonexistent status code", () => {
        const statusCode = 9999999;
        assertThrows(
          () => getReasonPhrase(statusCode),
          Error,
          GenericErrMessages.STATUS_CODE_DOES_NOT_EXIST(statusCode),
        );
      });

      Rhum.testCase("happy path", () => {
        codes.forEach((o) => {
          assertEquals(getReasonPhrase(o.code), o.phrase);
        });
      });
    },
  );
});

Rhum.run();
