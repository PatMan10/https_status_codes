import { Rhum } from "../../deps/dev.ts";
//---------------------------------------------------
import { IJsonCode } from "../../app/main/typescript/models/json-code.ts";
import { StatusCodes } from "../main/status-codes.ts";
import { ReasonPhrases } from "../main/reason-phrases.ts";
import { getReasonPhrase, getStatusCode } from "../main/utils/functions.ts";
import { currentModuleDir } from "../../app/main/typescript/utils/functions/current-module-dir.ts";

Deno.chdir(currentModuleDir(import.meta.url));

const { assertEquals, assertThrows } = Rhum.asserts;

Rhum.testPlan("lib.test.ts", () => {
  let codes: IJsonCode[];

  Rhum.beforeAll(async () => {
    codes = JSON.parse(
      await Deno.readTextFile(
        "../../app/main/resources/codes.json",
      ),
    );
  });

  Rhum.testSuite("Status Codes", () => {
    Rhum.testCase("StatusCodes", () => {
      // Divide by two because TypeScript enums contain both key and value
      // when values are Number types
      assertEquals(Object.keys(StatusCodes).length / 2, codes.length);
      codes.forEach((o) => {
        assertEquals((<any> StatusCodes)[o.constant], o.code as number);
      });
    });

    Rhum.testCase("getStatusCode", () => {
      codes.forEach((o) => {
        assertEquals(getStatusCode(o.phrase), o.code);
      });
    });

    Rhum.testCase("getStatusCode nonexistent code", () => {
      assertThrows(
        () => {
          getStatusCode("blah blah");
        },
        Error,
        "Reason phrase does not exist: blah blah",
      );
    });
  });

  Rhum.testSuite("Reason Phrases", () => {
    Rhum.testCase("ReasonPhrases", () => {
      assertEquals(Object.keys(ReasonPhrases).length, codes.length);
      codes.forEach((o) => {
        assertEquals((<any> ReasonPhrases)[o.constant], o.phrase);
      });
    });

    Rhum.testCase("getReasonPhrase", () => {
      codes.forEach((o) => {
        assertEquals(getReasonPhrase(o.code), o.phrase);
      });
    });

    Rhum.testCase("getReasonPhrase nonexistent phrase", () => {
      assertThrows(
        () => {
          getReasonPhrase(9999999);
        },
        Error,
        "Status code does not exist: 9999999",
      );
    });
  });
});

Rhum.run();
