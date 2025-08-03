(function () {
  "use strict";

  console.log("🌉 Loading Window Bridge...");

  // Step 1: Expose Ray to window (console)
  window.Ray = {
    async safeSetText(selector, text) {
      if (window.RayDOMInterface)
        return await window.RayDOMInterface.safeSetText(selector, text);
      throw new Error("RayDOMInterface not yet loaded");
    },
    async safeGetElement(selector, format = "text") {
      if (window.RayDOMInterface)
        return await window.RayDOMInterface.safeGetElement(selector, format);
      throw new Error("RayDOMInterface not yet loaded");
    },
    async safeClick(selector) {
      if (window.RayDOMInterface)
        return await window.RayDOMInterface.safeClick(selector);
      throw new Error("RayDOMInterface not yet loaded");
    },
    async safeGetFullDOM(options = {}) {
      if (window.RayDOMInterface)
        return await window.RayDOMInterface.safeGetFullDOM(options);
      throw new Error("RayDOMInterface not yet loaded");
    },
    elementExists(selector) {
      const exists = document.querySelector(selector) !== null;
      console.log(
        `🔍 Ray checked '${selector}': ${exists ? "EXISTS" : "NOT FOUND"}`
      );
      return exists;
    },
    async executeCommand(naturalLanguageCommand) {
      if (!window.RayCommandRouter)
        throw new Error("RayCommandRouter not loaded");
      if (!window.RayDOMInterface)
        throw new Error("RayDOMInterface not yet loaded");

      const routed = window.RayCommandRouter.route(naturalLanguageCommand);
      if (routed.error) throw new Error(routed.error);

      console.log(
        `🧠 Ray routing "${naturalLanguageCommand}" → ${
          routed.method
        }(${routed.args.join(", ")})`
      );
      return await window.RayDOMInterface[routed.method](...routed.args);
    },
    isBridge: true,
    bridgeVersion: "1.0.2",
    bridgeTimestamp: Date.now(),
  };

  console.log("🧠 Ray is now available in console as window.Ray");
  console.log(
    '✅ Try: await window.Ray.safeSetText("body", "👁️ Ray controls the DOM")'
  );

  // Step 2: Listen for external postMessage triggers
  console.log("🔗 Setting up Ray message listener in content script context");

  window.addEventListener("message", async (event) => {
    if (event.data.type !== "RAY_COMMAND") return;

    const { method, args, messageId } = event.data;
    try {
      if (!window.RayDOMInterface)
        throw new Error("RayDOMInterface not loaded");

      let result;
      if (method === "executeCommand") {
        if (!window.RayCommandRouter)
          throw new Error("RayCommandRouter not loaded");
        const routed = window.RayCommandRouter.route(args[0]);
        if (routed.error) throw new Error(routed.error);
        console.log(
          `🧠 Ray routing "${args[0]}" → ${routed.method}(${routed.args.join(
            ", "
          )})`
        );
        result = await window.RayDOMInterface[routed.method](...routed.args);
      } else if (typeof window.RayDOMInterface[method] === "function") {
        result = await window.RayDOMInterface[method](...args);
      } else {
        throw new Error(`Unknown Ray method: ${method}`);
      }

      window.postMessage(
        { type: "RAY_RESPONSE", method, messageId, success: true, result },
        "*"
      );
      console.log(`✅ Ray ${method} completed`);
    } catch (err) {
      console.warn(`❌ Ray ${method} failed:`, err.message);
      window.postMessage(
        {
          type: "RAY_RESPONSE",
          method,
          messageId,
          success: false,
          error: err.message,
        },
        "*"
      );
    }
  });

  console.log("✅ Ray message listener active");
  console.log("✅ Window Bridge loaded and operational");
})();
