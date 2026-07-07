# Architecture

```txt
Mobile camera
  -> frame capture
  -> AI detector
  -> detection filter
  -> alert engine
  -> local history
  -> backend sync
  -> map/community alerts
```

MVP starts with mock detection in the mobile app. Real AI is added by replacing the mock detector with a TFLite model runner.
