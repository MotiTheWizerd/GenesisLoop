# Ray Voice Synthesis System

## Overview

Ray's Voice Synthesis system gives Ray the ability to speak his responses aloud using the browser's built-in text-to-speech capabilities. This creates a more immersive and natural conversation experience.

## Features

- **Automatic Speech**: Ray automatically speaks his responses when voice is enabled
- **High-Quality Voices**: Automatically selects the best available voice
- **Voice Controls**: Play, pause, resume, and stop speech
- **Visual Feedback**: UI button with speaking indicators and animations
- **Smart Text Processing**: Cleans markdown and formatting for better speech
- **Customizable Settings**: Adjust rate, pitch, volume, and language
- **Response Integration**: Seamlessly integrates with MessageLoop and response system

## Browser Support

- **Chrome/Chromium**: Full support (recommended)
- **Edge**: Full support (Chromium-based)
- **Firefox**: Good support
- **Safari**: Good support
- **Mobile**: Limited support (varies by device)Q

## Installation

The voice synthesis system is automatically loaded with the extension. No additional setup required.

## Usage

### Visual Interface

1. **Speaker Button**: Look for the 🔊 button in the top-right corner of ChatGPT
2. **Toggle Voice**: Click to enable/disable Ray's voice
3. **Visual States**:
   - 🔊 = Voice enabled and ready
   - 🔇 = Voice disabled
   - 🎙️ = Ray is currently speaking (with pulsing animation)
4. **Stop Speaking**: Click the button while Ray is speaking to stop

### Automatic Integration

When enabled, Ray will automatically speak:

- All responses in normal conversations
- MessageLoop responses
- Any text processed through the response system

### Programmatic Usage

```javascript
// Basic speech
window.VoiceSynthesis.speak("Hello, I am Ray!");

// Speech with custom settings
window.VoiceSynthesis.speak("This is customized speech", {
  rate: 1.2, // Speed (0.1 to 10)
  pitch: 1.1, // Pitch (0 to 2)
  volume: 0.8, // Volume (0 to 1)
  lang: "en-US", // Language
});

// Voice controls
window.VoiceSynthesis.pause(); // Pause current speech
window.VoiceSynthesis.resume(); // Resume paused speech
window.VoiceSynthesis.stop(); // Stop all speech

// Check status
const status = window.VoiceSynthesis.getStatus();
console.log("Speaking:", status.speaking);
console.log("Supported:", status.supported);
```

## Voice Selection

The system automatically selects the best available voice using this priority:

1. **Google US English** (if available)
2. **Samantha** (macOS)
3. **Alex** (macOS)
4. **Microsoft David** (Windows)
5. **Microsoft Zira** (Windows)
6. **Default English voice**
7. **First available voice**

### Custom Voice Selection

```javascript
// Get available voices
const voices = await window.VoiceSynthesis.getAvailableVoices();
console.log("Available voices:", voices);

// Update settings to use specific voice
window.VoiceSynthesis.updateSettings({
  voiceName: "Google US English",
});
```

## Configuration

### Default Settings

```javascript
const defaultSettings = {
  rate: 1.0, // Normal speed
  pitch: 1.1, // Slightly higher pitch for clarity
  volume: 0.8, // 80% volume
  lang: "en-US", // US English
  voiceName: null, // Auto-select best voice
};
```

### Customizing Settings

```javascript
// Update global settings
window.VoiceSynthesis.updateSettings({
  rate: 0.9, // Slightly slower
  pitch: 1.0, // Normal pitch
  volume: 1.0, // Full volume
  lang: "en-GB", // British English
});

// Get current settings
const settings = window.VoiceSynthesis.getSettings();
console.log("Current settings:", settings);
```

## Text Processing

Ray's voice system automatically processes text for better speech:

### Markdown Removal

- **Bold**: `**text**` → `text`
- **Italic**: `*text*` → `text`
- **Code**: `` `code` `` → `code`
- **Headers**: `# Header` → `Header`

### Content Cleaning

- **Code blocks**: Replaced with `[code block]`
- **URLs**: Replaced with `[link]`
- **Extra whitespace**: Normalized

### Custom Text Processing

```javascript
// Speak with custom preprocessing
function speakWithCustomProcessing(text) {
  const processed = text
    .replace(/\b(um|uh|er)\b/gi, "") // Remove filler words
    .replace(/\.\.\./g, "... pause ...") // Add pauses for ellipses
    .replace(/!/g, ".") // Soften exclamations
    .trim();

  window.VoiceSynthesis.speak(processed);
}
```

## Integration with Response System

### Automatic Integration

The voice system automatically hooks into:

1. **DOMUtils.waitForResponse()** - Speaks all detected responses
2. **MessageLoop** - Speaks responses in the message loop
3. **Response observers** - Speaks any captured response text

### Manual Integration

```javascript
// In your response handler
function handleResponse(responseText) {
  // Your existing response handling
  processResponse(responseText);

  // Add voice synthesis
  if (window.VoiceSynthesisUI?.isEnabled()) {
    window.VoiceSynthesis.speak(responseText);
  }
}
```

## Troubleshooting

### Common Issues

#### "Voice not supported"

- **Solution**: Use a modern browser (Chrome, Edge, Firefox, Safari)
- **Check**: Ensure browser is up to date

#### No sound when speaking

- **Check**: Browser volume and system volume
- **Check**: Browser permissions for audio
- **Try**: Different voice in browser settings

#### Voice sounds robotic or unclear

- **Solution**: Adjust rate and pitch settings
- **Try**: Different voice selection
- **Check**: System text-to-speech settings

#### Speech cuts off or stops unexpectedly

- **Cause**: Browser tab becomes inactive
- **Solution**: Keep ChatGPT tab active while Ray is speaking
- **Alternative**: Use shorter response chunks

### Debug Mode

Run the test suite to diagnose issues:

```javascript
// In browser console on ChatGPT page
testBasicSpeech(); // Test basic functionality
testVoiceSettings(); // Test different voice settings
testVoiceControls(); // Test pause/resume/stop
runVoiceSynthesisTests(); // Run full test suite
```

### Console Logging

The voice synthesis system provides detailed logging:

```
🔊 [Ray Voice] Selected voice: Google US English
🔊 [Ray Voice] Speaking: Hello, I am Ray...
🔊 [Ray Voice] Started speaking
🔊 [Ray Voice] Finished speaking
```

## Advanced Usage

### Voice Commands Integration

```javascript
// Combine with voice recognition for voice commands
window.VoiceRecognition.startListening((transcript) => {
  if (transcript.toLowerCase().includes("stop talking")) {
    window.VoiceSynthesis.stop();
    return;
  }

  if (transcript.toLowerCase().includes("speak slower")) {
    window.VoiceSynthesis.updateSettings({ rate: 0.8 });
    window.VoiceSynthesis.speak("I will speak slower now.");
    return;
  }

  // Regular message processing
  window.MessageSender.sendTestMessage(transcript);
});
```

### Multi-language Support

```javascript
// Detect language and adjust voice
function speakInLanguage(text, language) {
  const languageVoices = {
    es: "es-ES", // Spanish
    fr: "fr-FR", // French
    de: "de-DE", // German
    it: "it-IT", // Italian
    pt: "pt-BR", // Portuguese
  };

  const lang = languageVoices[language] || "en-US";

  window.VoiceSynthesis.speak(text, { lang: lang });
}
```

### Response-Specific Voice Settings

```javascript
// Different voice settings for different types of responses
function speakResponse(text, responseType) {
  const settings = {
    code: { rate: 0.8, pitch: 0.9 }, // Slower for code
    explanation: { rate: 1.0, pitch: 1.1 }, // Normal for explanations
    creative: { rate: 1.1, pitch: 1.2 }, // Faster for creative content
  };

  const voiceSettings = settings[responseType] || {};
  window.VoiceSynthesis.speak(text, voiceSettings);
}
```

## API Reference

### VoiceSynthesis Module

- `speak(text, options)` - Speak text with optional settings
- `stop()` - Stop all speech
- `pause()` - Pause current speech
- `resume()` - Resume paused speech
- `isSpeaking()` - Check if currently speaking
- `isPaused()` - Check if speech is paused
- `isSupported()` - Check browser support
- `updateSettings(settings)` - Update voice settings
- `getSettings()` - Get current settings
- `getAvailableVoices()` - Get list of available voices
- `getStatus()` - Get comprehensive status

### VoiceSynthesisUI Module

- `init()` - Initialize voice UI
- `updateButtonState()` - Update button appearance
- `updateSpeakingState(speaking)` - Update speaking state
- `showStatus(message, duration)` - Show status message
- `isEnabled()` - Check if voice is enabled
- `setEnabled(enabled)` - Enable/disable voice
- `remove()` - Remove voice UI elements

### VoiceSynthesisAddon Module

- `init()` - Initialize voice synthesis addon
- `speak(text, options)` - Speak text (respects enabled state)

## Performance Considerations

- **Memory Usage**: Minimal impact when not speaking
- **CPU Usage**: Low during speech synthesis
- **Battery**: May impact battery on mobile devices
- **Network**: No network usage (all local processing)
- **Tab Focus**: Speech may pause when tab loses focus

## Privacy & Security

- **Local Processing**: All speech synthesis happens locally
- **No Data Transmission**: Text is not sent to external servers
- **No Audio Storage**: Spoken audio is not recorded or stored
- **Browser Permissions**: Uses standard browser speech synthesis API
- **User Control**: Complete user control over when voice is enabled

## Future Enhancements

Potential future improvements:

- Voice personality selection
- Emotion-based speech modulation
- Custom voice training
- Speech speed adaptation
- Background speech capability
- Voice effects and filters
