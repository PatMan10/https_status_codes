import { path, Rhum } from "../../../deps/dev.ts";
import { currentModuleDir, ErrorMessages } from "../../main/code/utils.ts";

const { assertEquals, assertThrows } = Rhum.asserts;

Rhum.testPlan("current-module-dir.ts", () => {
  Rhum.testSuite("currentModuleDir(url: string): string", () => {
    Rhum.testCase("url too short", () => {
      assertThrows(
        () => {
          currentModuleDir("URL");
        },
        Error,
        ErrorMessages.URL_TOO_SHORT,
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
