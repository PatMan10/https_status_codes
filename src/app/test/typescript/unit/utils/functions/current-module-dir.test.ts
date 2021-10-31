import { path, Rhum } from "../../../../../../deps/dev.ts";
//---------------------------------------------------
import { currentModuleDir } from "../../../../../main/utils/functions/current-module-dir.ts";
import { GenericErrMessages } from "../../../../../main/utils/classes/constants/error-messages.ts";

const { assertEquals, assertThrows } = Rhum.asserts;

Rhum.testPlan("current-module-dir.ts", () => {
  Rhum.testSuite("currentModuleDir(url: string): string", () => {
    Rhum.testCase("url too short", () => {
      assertThrows(
        () => {
          currentModuleDir("URL");
        },
        Error,
        GenericErrMessages.URL_TOO_SHORT,
      );
    });

    Rhum.testCase("happy path", () => {
      assertEquals(
        currentModuleDir(import.meta.url),
        path.dirname(import.meta.url.substring(7)),
      );
    });
  });
});

Rhum.run();
