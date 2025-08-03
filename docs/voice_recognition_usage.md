# Voice Recognition Usage Guide

## Overview

The Voice Recognition addon enables speech-to-text functionality for your ChatGPT extension, allowing users to speak their messages instead of typing them.

## Features

- **Always-on or Push-to-talk**: Toggle voice recognition on/off
- **Auto-transcription**: Converts speech to text automatically
- **ChatGPT Integration**: Injects transcribed text directly into ChatGPT's message input
- **Auto-send**: Automatically sends messages or waits for confirmation
- **Visual Feedback**: UI button with status indicators
- **Error Handling**: Robust error handling with auto-restart capabilities

## Browser Support

- **Chrome/Chromium**: Full support (uses webkitSpeechRecognition)
- **Edge**: Full support (Chromium-based)
- **Firefox**: Limited support (may require additional configuration)
- **Safari**: Not supported (different speech recognition API)

## Installation

The voice recognition system is automatically loaded with the extension. No additional setup required.

### Required Permissions

The extension automatically requests microphone access when voice recognition is first used.

## Usage

### Visual Interface

1. **Voice Button**: Look for the 🎤 button in the top-right corner of ChatGPT
2. **Click to Toggle**: Click the button to start/stop voice recognition
3. **Visual Feedback**: 
   - 🎤 = Ready to listen
   - 🔴 = Currently listening
   - Status indicator shows current state

### Programmatic Usage

```javascript
// Start voice recognition with callback
window.VoiceRecognition.startListening((transcript) => {
  console.log('Received:', transcript);
  // Auto-send to ChatGPT
  window.MessageSender.sendTestMessage(transcript);
});

// Stop voice recognition
window.VoiceRecognition.stopListening();

// Toggle voice recognition
const isListening = window.VoiceRecognition.toggleListening((transcript) => {
  // Handle transcript
});

// Check status
const status = window.VoiceRecognition.getStatus();
console.log('Supported:', status.supported);
console.log('Listening:', status.listening);
```

## Configuration

### Voice Recognition Settings

The voice recognition uses these default settings:

```javascript
recognition.continuous = true;      // Keep listening
recognition.interimResults = false; // Only final results
recognition.lang = 'en-US';        // English (US)
```

### Customization

To modify voice recognition behavior, edit `js/addons/voice-recognition/voiceRecognition.js`:

```javascript
// Change language
recognition.lang = 'en-GB'; // British English

// Enable interim results for real-time feedback
recognition.interimResults = true;

// Disable continuous listening (single command mode)
recognition.continuous = false;
```

## Integration with MessageLoop

The voice recognition automatically integrates with your existing MessageLoop system:

1. **Voice Input** → **Transcription** → **MessageSender** → **ChatGPT**
2. **Response Detection** → **Continue Loop** (if MessageLoop is active)

## Troubleshooting

### Common Issues

#### "Microphone access denied"
- **Solution**: Enable microphone permissions in browser settings
- **Chrome**: Settings → Privacy and security → Site settings → Microphone
- **Allow** for chatgpt.com

#### "Speech recognition not supported"
- **Solution**: Use Chrome or Chromium-based browser
- **Alternative**: Update browser to latest version

#### Voice recognition stops unexpectedly
- **Auto-restart**: The system automatically restarts recognition
- **Manual restart**: Click the voice button to restart
- **Check console**: Look for error messages in browser console

#### Poor recognition accuracy
- **Speak clearly**: Ensure clear pronunciation
- **Reduce noise**: Use in quiet environment
- **Check microphone**: Ensure microphone is working properly
- **Language setting**: Verify correct language is set

### Debug Mode

Run the test suite to diagnose issues:

```javascript
// In browser console on ChatGPT page
// Load test file or run:
testVoiceRecognition();
```

### Console Logging

The voice recognition system provides detailed logging:

```
🎤 [Ray Voice] Listening started
🎤 [Ray Voice] Transcript: hello world
🎤 [Ray Voice] Recognition stopped
🎤 [Ray Voice] Auto-restarting...
```

## Advanced Usage

### Custom Transcript Processing

```javascript
// Custom processing before sending to ChatGPT
window.VoiceRecognition.startListening((transcript) => {
  // Process transcript
  const processed = transcript
    .toLowerCase()
    .replace(/period/g, '.')
    .replace(/comma/g, ',')
    .replace(/question mark/g, '?');
  
  // Send processed text
  window.MessageSender.sendTestMessage(processed);
});
```

### Voice Commands

```javascript
// Add voice command processing
window.VoiceRecognition.startListening((transcript) => {
  const command = transcript.toLowerCase();
  
  if (command.includes('stop listening')) {
    window.VoiceRecognition.stopListening();
    return;
  }
  
  if (command.includes('clear message')) {
    // Clear input field
    const textarea = document.querySelector('textarea');
    if (textarea) textarea.value = '';
    return;
  }
  
  // Regular message
  window.MessageSender.sendTestMessage(transcript);
});
```

## API Reference

### VoiceRecognition Module

- `startListening(callback)` - Start voice recognition
- `stopListening()` - Stop voice recognition  
- `toggleListening(callback)` - Toggle voice recognition
- `isSupported()` - Check browser support
- `getStatus()` - Get current status

### VoiceUI Module

- `init()` - Initialize voice UI
- `updateButtonState(isListening)` - Update button appearance
- `showStatus(message, duration)` - Show status message
- `remove()` - Remove voice UI elements

## Security Considerations

- **Microphone Access**: Only requested when voice recognition is used
- **Local Processing**: Speech recognition happens locally in browser
- **No Audio Storage**: Audio is not stored or transmitted
- **Privacy**: Transcripts are only sent to ChatGPT when user activates voice

## Performance

- **Minimal Impact**: Voice recognition runs only when activated
- **Auto-restart**: Handles network interruptions gracefully
- **Memory Management**: Properly cleans up resources when stopped
- **Error Recovery**: Robust error handling prevents crashes