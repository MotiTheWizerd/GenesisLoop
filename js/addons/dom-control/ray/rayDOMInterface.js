(function () {
  "use strict";

  // Ray's DOM Interface - High-level interface for Ray's DOM control needs
  const RayDOMInterface = {
    // Ray's DOM health and recovery methods
    async checkSystemHealth() {
      console.log("🔍 Ray performing system health check...");

      if (window.DOMHealthChecker) {
        return window.DOMHealthChecker.performHealthCheck();
      } else {
        // Fallback health check
        const isHealthy =
          typeof window.DOMAPI === "object" &&
          typeof window.DOMAPI.getElement === "function";

        if (!isHealthy) {
          console.log("⚠️ DOMAPI missing. Attempting self-repair...");
          return this.attemptSelfRepair();
        }

        return {
          overall: true,
          timestamp: Date.now(),
          source: "fallback_check",
        };
      }
    },

    async attemptSelfRepair() {
      console.log("🚨 Ray initiating self-repair sequence...");

      if (window.DOMRecoverySystem) {
        return await window.DOMRecoverySystem.initiateRecovery("ray_initiated");
      } else {
        // Fallback repair
        if (typeof window.injectEmergencyDOMAPI === "function") {
          console.log("🔧 Using emergency DOM API injection...");
          const success = window.injectEmergencyDOMAPI();

          if (success) {
            console.log(
              "✅ Emergency DOMAPI restored via injectEmergencyDOMAPI()"
            );
            return true;
          } else {
            console.log("❌ Emergency repair failed");
            return false;
          }
        } else {
          console.log(
            "❌ injectEmergencyDOMAPI() not found. Manual intervention required."
          );
          return false;
        }
      }
    },

    // Ray's safe DOM operations with auto-repair
    async safeGetElement(selector, format = "text") {
      try {
        // Check if DOMAPI is available
        if (
          typeof window.DOMAPI !== "object" ||
          typeof window.DOMAPI.getElement !== "function"
        ) {
          console.log("⚠️ DOMAPI not available, attempting repair...");
          const repairSuccess = await this.attemptSelfRepair();

          if (!repairSuccess) {
            throw new Error("DOMAPI unavailable and repair failed");
          }
        }

        // Perform the operation
        const result = await window.DOMAPI.getElement(selector, format);

        // Log successful operation
        if (result.source === "emergency" || result.source === "fallback") {
          console.log(`🔧 Operation completed using ${result.source} API`);
        }

        return result;
      } catch (error) {
        console.log(`❌ safeGetElement failed for ${selector}:`, error.message);

        // Attempt one more repair
        console.log("🔄 Attempting final repair...");
        const repairSuccess = await this.attemptSelfRepair();

        if (repairSuccess) {
          try {
            return await window.DOMAPI.getElement(selector, format);
          } catch (retryError) {
            console.log(
              "❌ Retry after repair also failed:",
              retryError.message
            );
            throw retryError;
          }
        } else {
          throw error;
        }
      }
    },

    async safeGetFullDOM(options = {}) {
      try {
        // Check if DOMAPI is available
        if (
          typeof window.DOMAPI !== "object" ||
          typeof window.DOMAPI.getFullDOM !== "function"
        ) {
          console.log("⚠️ DOMAPI not available, attempting repair...");
          const repairSuccess = await this.attemptSelfRepair();

          if (!repairSuccess) {
            throw new Error("DOMAPI unavailable and repair failed");
          }
        }

        // Perform the operation
        const result = await window.DOMAPI.getFullDOM(options);

        // Log successful operation
        if (result.source === "emergency" || result.source === "fallback") {
          console.log(`🔧 Operation completed using ${result.source} API`);
        }

        return result;
      } catch (error) {
        console.log("❌ safeGetFullDOM failed:", error.message);

        // Attempt one more repair
        console.log("🔄 Attempting final repair...");
        const repairSuccess = await this.attemptSelfRepair();

        if (repairSuccess) {
          try {
            return await window.DOMAPI.getFullDOM(options);
          } catch (retryError) {
            console.log(
              "❌ Retry after repair also failed:",
              retryError.message
            );
            throw retryError;
          }
        } else {
          throw error;
        }
      }
    },

    async safeElementExists(selector) {
      try {
        // Check if DOMAPI is available
        if (
          typeof window.DOMAPI !== "object" ||
          typeof window.DOMAPI.elementExists !== "function"
        ) {
          console.log("⚠️ DOMAPI not available, attempting repair...");
          const repairSuccess = await this.attemptSelfRepair();

          if (!repairSuccess) {
            // Fallback to native DOM
            return document.querySelector(selector) !== null;
          }
        }

        return window.DOMAPI.elementExists(selector);
      } catch (error) {
        console.log(
          `❌ safeElementExists failed for ${selector}:`,
          error.message
        );
        // Fallback to native DOM
        return document.querySelector(selector) !== null;
      }
    },

    async safeSetText(selector, text) {
      try {
        // Check if DOMAPI is available
        if (
          typeof window.DOMAPI !== "object" ||
          typeof window.DOMAPI.setText !== "function"
        ) {
          console.log("⚠️ DOMAPI not available, attempting repair...");
          const repairSuccess = await this.attemptSelfRepair();

          if (!repairSuccess) {
            throw new Error("DOMAPI unavailable and repair failed");
          }
        }

        // Perform the operation
        const result = await window.DOMAPI.setText(selector, text);

        // Log successful operation
        if (result.source === "emergency" || result.source === "fallback") {
          console.log(`🔧 setText completed using ${result.source} API`);
        }

        return result;
      } catch (error) {
        console.log(`❌ safeSetText failed for ${selector}:`, error.message);

        // Attempt one more repair
        console.log("🔄 Attempting final repair...");
        const repairSuccess = await this.attemptSelfRepair();

        if (repairSuccess) {
          try {
            return await window.DOMAPI.setText(selector, text);
          } catch (retryError) {
            console.log(
              "❌ Retry after repair also failed:",
              retryError.message
            );
            throw retryError;
          }
        } else {
          throw error;
        }
      }
    },

    async safeSetHTML(selector, html) {
      try {
        // Check if DOMAPI is available
        if (
          typeof window.DOMAPI !== "object" ||
          typeof window.DOMAPI.setHTML !== "function"
        ) {
          console.log("⚠️ DOMAPI not available, attempting repair...");
          const repairSuccess = await this.attemptSelfRepair();

          if (!repairSuccess) {
            throw new Error("DOMAPI unavailable and repair failed");
          }
        }

        // Perform the operation
        const result = await window.DOMAPI.setHTML(selector, html);

        // Log successful operation
        if (result.source === "emergency" || result.source === "fallback") {
          console.log(`🔧 setHTML completed using ${result.source} API`);
        }

        return result;
      } catch (error) {
        console.log(`❌ safeSetHTML failed for ${selector}:`, error.message);

        // Attempt one more repair
        console.log("🔄 Attempting final repair...");
        const repairSuccess = await this.attemptSelfRepair();

        if (repairSuccess) {
          try {
            return await window.DOMAPI.setHTML(selector, html);
          } catch (retryError) {
            console.log(
              "❌ Retry after repair also failed:",
              retryError.message
            );
            throw retryError;
          }
        } else {
          throw error;
        }
      }
    },

    async safeClick(selector) {
      try {
        // Check if DOMAPI is available
        if (
          typeof window.DOMAPI !== "object" ||
          typeof window.DOMAPI.clickElement !== "function"
        ) {
          console.log("⚠️ DOMAPI not available, attempting repair...");
          const repairSuccess = await this.attemptSelfRepair();

          if (!repairSuccess) {
            throw new Error("DOMAPI unavailable and repair failed");
          }
        }

        // Perform the operation
        const result = await window.DOMAPI.clickElement(selector);

        // Log successful operation
        if (result.source === "emergency" || result.source === "fallback") {
          console.log(`🔧 click completed using ${result.source} API`);
        }

        return result;
      } catch (error) {
        console.log(`❌ safeClick failed for ${selector}:`, error.message);

        // Attempt one more repair
        console.log("🔄 Attempting final repair...");
        const repairSuccess = await this.attemptSelfRepair();

        if (repairSuccess) {
          try {
            return await window.DOMAPI.clickElement(selector);
          } catch (retryError) {
            console.log(
              "❌ Retry after repair also failed:",
              retryError.message
            );
            throw retryError;
          }
        } else {
          throw error;
        }
      }
    },

    async safeSetAttribute(selector, attributes) {
      try {
        // Check if DOMAPI is available
        if (
          typeof window.DOMAPI !== "object" ||
          typeof window.DOMAPI.setAttribute !== "function"
        ) {
          console.log("⚠️ DOMAPI not available, attempting repair...");
          const repairSuccess = await this.attemptSelfRepair();

          if (!repairSuccess) {
            throw new Error("DOMAPI unavailable and repair failed");
          }
        }

        // Perform the operation
        const result = await window.DOMAPI.setAttribute(selector, attributes);

        // Log successful operation
        if (result.source === "emergency" || result.source === "fallback") {
          console.log(`🔧 setAttribute completed using ${result.source} API`);
        }

        return result;
      } catch (error) {
        console.log(
          `❌ safeSetAttribute failed for ${selector}:`,
          error.message
        );

        // Attempt one more repair
        console.log("🔄 Attempting final repair...");
        const repairSuccess = await this.attemptSelfRepair();

        if (repairSuccess) {
          try {
            return await window.DOMAPI.setAttribute(selector, attributes);
          } catch (retryError) {
            console.log(
              "❌ Retry after repair also failed:",
              retryError.message
            );
            throw retryError;
          }
        } else {
          throw error;
        }
      }
    },

    async safeAddClass(selector, className) {
      try {
        // Check if DOMAPI is available
        if (
          typeof window.DOMAPI !== "object" ||
          typeof window.DOMAPI.addClass !== "function"
        ) {
          console.log("⚠️ DOMAPI not available, attempting repair...");
          const repairSuccess = await this.attemptSelfRepair();

          if (!repairSuccess) {
            throw new Error("DOMAPI unavailable and repair failed");
          }
        }

        // Perform the operation
        const result = await window.DOMAPI.addClass(selector, className);

        // Log successful operation
        if (result.source === "emergency" || result.source === "fallback") {
          console.log(`🔧 addClass completed using ${result.source} API`);
        }

        return result;
      } catch (error) {
        console.log(`❌ safeAddClass failed for ${selector}:`, error.message);

        // Attempt one more repair
        console.log("🔄 Attempting final repair...");
        const repairSuccess = await this.attemptSelfRepair();

        if (repairSuccess) {
          try {
            return await window.DOMAPI.addClass(selector, className);
          } catch (retryError) {
            console.log(
              "❌ Retry after repair also failed:",
              retryError.message
            );
            throw retryError;
          }
        } else {
          throw error;
        }
      }
    },

    async safeRemoveClass(selector, className) {
      try {
        // Check if DOMAPI is available
        if (
          typeof window.DOMAPI !== "object" ||
          typeof window.DOMAPI.removeClass !== "function"
        ) {
          console.log("⚠️ DOMAPI not available, attempting repair...");
          const repairSuccess = await this.attemptSelfRepair();

          if (!repairSuccess) {
            throw new Error("DOMAPI unavailable and repair failed");
          }
        }

        // Perform the operation
        const result = await window.DOMAPI.removeClass(selector, className);

        // Log successful operation
        if (result.source === "emergency" || result.source === "fallback") {
          console.log(`🔧 removeClass completed using ${result.source} API`);
        }

        return result;
      } catch (error) {
        console.log(
          `❌ safeRemoveClass failed for ${selector}:`,
          error.message
        );

        // Attempt one more repair
        console.log("🔄 Attempting final repair...");
        const repairSuccess = await this.attemptSelfRepair();

        if (repairSuccess) {
          try {
            return await window.DOMAPI.removeClass(selector, className);
          } catch (retryError) {
            console.log(
              "❌ Retry after repair also failed:",
              retryError.message
            );
            throw retryError;
          }
        } else {
          throw error;
        }
      }
    },

    async safeToggleClass(selector, className) {
      try {
        // Check if DOMAPI is available
        if (
          typeof window.DOMAPI !== "object" ||
          typeof window.DOMAPI.toggleClass !== "function"
        ) {
          console.log("⚠️ DOMAPI not available, attempting repair...");
          const repairSuccess = await this.attemptSelfRepair();

          if (!repairSuccess) {
            throw new Error("DOMAPI unavailable and repair failed");
          }
        }

        // Perform the operation
        const result = await window.DOMAPI.toggleClass(selector, className);

        // Log successful operation
        if (result.source === "emergency" || result.source === "fallback") {
          console.log(`🔧 toggleClass completed using ${result.source} API`);
        }

        return result;
      } catch (error) {
        console.log(
          `❌ safeToggleClass failed for ${selector}:`,
          error.message
        );

        // Attempt one more repair
        console.log("🔄 Attempting final repair...");
        const repairSuccess = await this.attemptSelfRepair();

        if (repairSuccess) {
          try {
            return await window.DOMAPI.toggleClass(selector, className);
          } catch (retryError) {
            console.log(
              "❌ Retry after repair also failed:",
              retryError.message
            );
            throw retryError;
          }
        } else {
          throw error;
        }
      }
    },

    async safeRemoveElement(selector) {
      try {
        // Check if DOMAPI is available
        if (
          typeof window.DOMAPI !== "object" ||
          typeof window.DOMAPI.removeElement !== "function"
        ) {
          console.log("⚠️ DOMAPI not available, attempting repair...");
          const repairSuccess = await this.attemptSelfRepair();

          if (!repairSuccess) {
            throw new Error("DOMAPI unavailable and repair failed");
          }
        }

        // Perform the operation
        const result = await window.DOMAPI.removeElement(selector);

        // Log successful operation
        if (result.source === "emergency" || result.source === "fallback") {
          console.log(`🔧 removeElement completed using ${result.source} API`);
        }

        return result;
      } catch (error) {
        console.log(
          `❌ safeRemoveElement failed for ${selector}:`,
          error.message
        );

        // Attempt one more repair
        console.log("🔄 Attempting final repair...");
        const repairSuccess = await this.attemptSelfRepair();

        if (repairSuccess) {
          try {
            return await window.DOMAPI.removeElement(selector);
          } catch (retryError) {
            console.log(
              "❌ Retry after repair also failed:",
              retryError.message
            );
            throw retryError;
          }
        } else {
          throw error;
        }
      }
    },

    async safeWaitForElement(selector, timeout = 5000) {
      try {
        // Check if DOMAPI is available
        if (
          typeof window.DOMAPI !== "object" ||
          typeof window.DOMAPI.waitForElement !== "function"
        ) {
          console.log("⚠️ DOMAPI not available, attempting repair...");
          const repairSuccess = await this.attemptSelfRepair();

          if (!repairSuccess) {
            throw new Error("DOMAPI unavailable and repair failed");
          }
        }

        // Perform the operation
        const result = await window.DOMAPI.waitForElement(selector, timeout);

        console.log(`🔧 waitForElement completed for ${selector}`);
        return result;
      } catch (error) {
        console.log(
          `❌ safeWaitForElement failed for ${selector}:`,
          error.message
        );

        // Attempt one more repair
        console.log("🔄 Attempting final repair...");
        const repairSuccess = await this.attemptSelfRepair();

        if (repairSuccess) {
          try {
            return await window.DOMAPI.waitForElement(selector, timeout);
          } catch (retryError) {
            console.log(
              "❌ Retry after repair also failed:",
              retryError.message
            );
            throw retryError;
          }
        } else {
          throw error;
        }
      }
    },

    // Ray's system status and diagnostics
    getSystemStatus() {
      const status = {
        timestamp: Date.now(),
        domapi: {
          available: typeof window.DOMAPI === "object",
          isEmergency: window.DOMAPI?.isEmergencyAPI === true,
          isFallback: window.DOMAPI?.isFallbackMode === true,
          methods: {},
        },
        healthChecker: {
          available: typeof window.DOMHealthChecker === "object",
          status: window.DOMHealthChecker?.getStatus() || null,
        },
        recoverySystem: {
          available: typeof window.DOMRecoverySystem === "object",
          stats: window.DOMRecoverySystem?.getRecoveryStats() || null,
        },
        emergencyInjector: {
          available: typeof window.injectEmergencyDOMAPI === "function",
        },
      };

      // Check DOMAPI methods
      if (status.domapi.available) {
        const requiredMethods = [
          "getFullDOM",
          "getElement",
          "setText",
          "setHTML",
          "clickElement",
          "setAttribute",
          "addClass",
          "removeClass",
          "toggleClass",
          "removeElement",
          "waitForElement",
          "elementExists",
        ];
        requiredMethods.forEach((method) => {
          status.domapi.methods[method] =
            typeof window.DOMAPI[method] === "function";
        });
      }

      return status;
    },

    // Ray's diagnostic report
    generateDiagnosticReport() {
      console.log("📊 Ray generating diagnostic report...");

      const report = {
        timestamp: new Date().toISOString(),
        systemStatus: this.getSystemStatus(),
        healthHistory: window.DOMHealthChecker?.getHealthHistory() || [],
        recoveryLogs: window.DOMRecoverySystem?.getRecoveryLogs() || [],
        recommendations: [],
      };

      // Generate recommendations
      if (!report.systemStatus.domapi.available) {
        report.recommendations.push(
          "CRITICAL: DOMAPI not available - immediate repair needed"
        );
      } else if (report.systemStatus.domapi.isEmergency) {
        report.recommendations.push(
          "WARNING: Using emergency API - consider extension reload"
        );
      } else if (report.systemStatus.domapi.isFallback) {
        report.recommendations.push(
          "WARNING: Using fallback mode - limited functionality"
        );
      }

      if (report.systemStatus.recoverySystem.stats?.successRate) {
        const successRate = parseFloat(
          report.systemStatus.recoverySystem.stats.successRate
        );
        if (successRate < 80) {
          report.recommendations.push(
            "CONCERN: Low recovery success rate - system may be unstable"
          );
        }
      }

      if (!report.systemStatus.emergencyInjector.available) {
        report.recommendations.push(
          "WARNING: Emergency injector not available - limited self-repair capability"
        );
      }

      console.log("📋 Diagnostic Report:", report);
      return report;
    },

    // Ray's heartbeat check - to be called periodically
    async performHeartbeatCheck() {
      const healthReport = await this.checkSystemHealth();

      if (!healthReport.overall) {
        console.log("💓 Heartbeat detected DOM issues, initiating repair...");
        await this.attemptSelfRepair();
      }

      return healthReport;
    },

    // Ray's memory of repairs - for learning and optimization
    getRepairMemory() {
      const memory = {
        totalRepairs: 0,
        successfulRepairs: 0,
        failedRepairs: 0,
        commonIssues: {},
        repairStrategies: {},
        lastRepairTime: null,
      };

      if (window.DOMRecoverySystem) {
        const stats = window.DOMRecoverySystem.getRecoveryStats();
        const logs = window.DOMRecoverySystem.getRecoveryLogs();

        memory.totalRepairs = stats.totalAttempts;
        memory.successfulRepairs = stats.successful;
        memory.failedRepairs = stats.failed;
        memory.lastRepairTime = stats.lastRecovery;

        // Analyze common issues and strategies
        logs.forEach((log) => {
          if (log.error) {
            memory.commonIssues[log.error] =
              (memory.commonIssues[log.error] || 0) + 1;
          }

          log.strategies.forEach((strategy) => {
            if (!memory.repairStrategies[strategy]) {
              memory.repairStrategies[strategy] = { attempts: 0, successes: 0 };
            }
            memory.repairStrategies[strategy].attempts++;
            if (log.success) {
              memory.repairStrategies[strategy].successes++;
            }
          });
        });
      }

      return memory;
    },
  };

  // Expose to window for Ray's access
  window.testRayDOMInterface = RayDOMInterface;

  console.log("✅ Ray DOM Interface loaded");
})();
