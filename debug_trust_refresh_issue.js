// Debug Trust System Refresh Issue
// Run this in browser console to diagnose trust system problems after refresh

console.log("🔍 Debugging Trust System Refresh Issue...");

function checkTrustSystemAfterRefresh() {
  console.log("\n=== Trust System Post-Refresh Diagnostic ===");

  // Check if all trust components are loaded
  const trustComponents = [
    "RayTrustCore",
    "RayTrustUI",
    "RayTrustIntegration",
    "RayTrustSystem",
  ];

  const loadedComponents = [];
  const missingComponents = [];

  trustComponents.forEach((component) => {
    if (window[component]) {
      loadedComponents.push(component);
      console.log(`✅ ${component} loaded`);
    } else {
      missingComponents.push(component);
      console.error(`❌ ${component} NOT loaded`);
    }
  });

  if (missingComponents.length > 0) {
    console.error("🚨 Missing trust components:", missingComponents);
    return false;
  }

  // Check if trust system is initialized
  if (window.RayTrustSystem) {
    const status = window.RayTrustSystem.getStatus();
    console.log("Trust System Status:", status);

    if (!status.initialized) {
      console.warn("⚠️ Trust system loaded but not initialized");

      // Try to initialize manually
      console.log("🔧 Attempting manual initialization...");
      window.RayTrustSystem.init()
        .then(() => {
          console.log("✅ Manual initialization successful");
          checkTrustRecording();
        })
        .catch((error) => {
          console.error("❌ Manual initialization failed:", error);
        });

      return false;
    }
  }

  return true;
}

function checkTrustRecording() {
  console.log("\n=== Trust Recording Test ===");

  if (!window.RayTrustCore) {
    console.error("❌ RayTrustCore not available for recording test");
    return;
  }

  // Get initial trust level
  const initialLevel = window.RayTrustCore.getLevel();
  console.log("Initial trust level:", initialLevel.level);

  // Try to record a test action
  try {
    const newLevel = window.RayTrustCore.recordAction("HELPFUL_RESPONSE", {
      test: "Post-refresh recording test",
      timestamp: Date.now(),
    });

    console.log("✅ Trust action recorded successfully");
    console.log("New trust level:", newLevel);

    if (newLevel !== initialLevel.level) {
      console.log("✅ Trust level changed - recording is working");
    } else {
      console.warn("⚠️ Trust level unchanged - possible calculation issue");
    }
  } catch (error) {
    console.error("❌ Trust recording failed:", error);
  }
}

function checkTrustIntegration() {
  console.log("\n=== Trust Integration Check ===");

  if (!window.RayTrustIntegration) {
    console.error("❌ RayTrustIntegration not available");
    return;
  }

  const integrationStatus = window.RayTrustIntegration.getStatus();
  console.log("Integration Status:", integrationStatus);

  if (!integrationStatus.active) {
    console.warn("⚠️ Trust integration not active");

    // Try to initialize integration manually
    console.log("🔧 Attempting manual integration initialization...");
    const success = window.RayTrustIntegration.init();

    if (success) {
      console.log("✅ Manual integration initialization successful");
    } else {
      console.error("❌ Manual integration initialization failed");
    }
  }

  // Check which systems are integrated
  const integratedSystems = Object.entries(integrationStatus.integratedSystems)
    .filter(([system, integrated]) => integrated)
    .map(([system]) => system);

  console.log("Integrated systems:", integratedSystems);

  if (integratedSystems.length === 0) {
    console.warn("⚠️ No systems integrated with trust metrics");
  }
}

function checkTrustUI() {
  console.log("\n=== Trust UI Check ===");

  // Look for trust button
  const trustButton = document.querySelector('button[title*="Trust"]');

  if (trustButton) {
    console.log("✅ Trust button found in DOM");
    console.log("Button styles:", {
      position: trustButton.style.position,
      top: trustButton.style.top,
      right: trustButton.style.right,
      display: trustButton.style.display,
      visibility: trustButton.style.visibility,
    });

    // Check if button is visible
    const rect = trustButton.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      console.log("✅ Trust button is visible");
    } else {
      console.warn("⚠️ Trust button exists but not visible");
    }
  } else {
    console.error("❌ Trust button not found in DOM");

    // Check if UI is hidden
    if (window.RayUIToggle && !window.RayUIToggle.isVisible()) {
      console.log("💡 Ray UI is hidden - try Ctrl+Shift+H to show");
    }

    // Try to create UI manually
    if (window.RayTrustUI) {
      console.log("🔧 Attempting manual UI creation...");
      window.RayTrustUI.init();

      setTimeout(() => {
        const newButton = document.querySelector('button[title*="Trust"]');
        if (newButton) {
          console.log("✅ Trust button created manually");
        } else {
          console.error("❌ Manual UI creation failed");
        }
      }, 1000);
    }
  }
}

function checkTrustPersistence() {
  console.log("\n=== Trust Persistence Check ===");

  // Check localStorage for trust data
  try {
    const trustData = localStorage.getItem("rayTrustData");
    if (trustData) {
      const parsed = JSON.parse(trustData);
      console.log("✅ Trust data found in localStorage");
      console.log("Stored trust level:", parsed.currentLevel);
      console.log("Stored interactions:", parsed.interactions?.length || 0);
    } else {
      console.warn("⚠️ No trust data in localStorage");
    }
  } catch (error) {
    console.error("❌ Error reading trust data from localStorage:", error);
  }
}

function fixTrustSystemIssues() {
  console.log("\n=== Trust System Auto-Fix ===");

  let fixesApplied = 0;

  // Fix 1: Ensure trust system is initialized
  if (window.RayTrustSystem && !window.RayTrustSystem.getStatus().initialized) {
    console.log("🔧 Fix 1: Initializing trust system...");
    window.RayTrustSystem.init()
      .then(() => {
        console.log("✅ Trust system initialized");
        fixesApplied++;
      })
      .catch((error) => {
        console.error("❌ Trust system initialization failed:", error);
      });
  }

  // Fix 2: Ensure integration is active
  if (
    window.RayTrustIntegration &&
    !window.RayTrustIntegration.getStatus().active
  ) {
    console.log("🔧 Fix 2: Activating trust integration...");
    const success = window.RayTrustIntegration.init();
    if (success) {
      console.log("✅ Trust integration activated");
      fixesApplied++;
    }
  }

  // Fix 3: Ensure UI is created
  if (!document.querySelector('button[title*="Trust"]')) {
    console.log("🔧 Fix 3: Creating trust UI...");
    if (window.RayTrustUI) {
      window.RayTrustUI.init();
      fixesApplied++;
    }
  }

  // Fix 4: Test trust recording
  setTimeout(() => {
    if (window.RayTrustCore) {
      console.log("🔧 Fix 4: Testing trust recording...");
      try {
        window.RayTrustCore.recordAction("SYSTEM_INTERACTION", {
          fix: "Auto-fix test",
          timestamp: Date.now(),
        });
        console.log("✅ Trust recording test successful");
        fixesApplied++;
      } catch (error) {
        console.error("❌ Trust recording test failed:", error);
      }
    }

    console.log(`🎯 Applied ${fixesApplied} fixes to trust system`);
  }, 2000);
}

// Run all diagnostics
function runFullTrustDiagnostic() {
  console.log("🔍 === Full Trust System Diagnostic ===");

  const systemOK = checkTrustSystemAfterRefresh();

  setTimeout(() => {
    checkTrustIntegration();
  }, 1000);

  setTimeout(() => {
    checkTrustUI();
  }, 2000);

  setTimeout(() => {
    checkTrustPersistence();
  }, 3000);

  setTimeout(() => {
    if (!systemOK) {
      fixTrustSystemIssues();
    }
  }, 4000);
}

// Auto-run diagnostic
runFullTrustDiagnostic();

// Expose functions for manual use
window.checkTrustSystemAfterRefresh = checkTrustSystemAfterRefresh;
window.checkTrustRecording = checkTrustRecording;
window.checkTrustIntegration = checkTrustIntegration;
window.checkTrustUI = checkTrustUI;
window.fixTrustSystemIssues = fixTrustSystemIssues;
window.runFullTrustDiagnostic = runFullTrustDiagnostic;

console.log("\n💡 Available manual diagnostic functions:");
console.log("- checkTrustSystemAfterRefresh()");
console.log("- checkTrustRecording()");
console.log("- checkTrustIntegration()");
console.log("- checkTrustUI()");
console.log("- fixTrustSystemIssues()");
console.log("- runFullTrustDiagnostic()");
