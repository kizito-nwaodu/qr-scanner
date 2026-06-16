# QR Code Scanner Mobile App

A mobile application for scanning QR codes with share and history features built with React Native and Expo.

## Features

✨ **QR Code Scanning**
- Real-time QR code detection using device camera
- Instant result display upon successful scan

🔄 **Share Results**
- Share scanned QR code data via system share menu
- Easy data copying to clipboard
- Support for multiple sharing methods

📱 **Scan History**
- Automatic storage of all scanned QR codes
- Timestamped history entries
- Quick share and delete actions from history
- Clear all history option

🔐 **Camera & Gallery Permissions**
- Proper permission handling for camera access
- Photo gallery access for image selection
- iOS and Android permission configurations included

## Permissions

### Android Permissions
- `android.permission.CAMERA` - Access device camera
- `android.permission.READ_EXTERNAL_STORAGE` - Read photo gallery
- `android.permission.WRITE_EXTERNAL_STORAGE` - Write to storage

### iOS Permissions
- `NSCameraUsageDescription` - Camera access for QR scanning
- `NSPhotoLibraryUsageDescription` - Photo library access
- `NSPhotoLibraryAddUsageDescription` - Photo saving permission

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kizito-nwaodu/qr-scanner.git
   cd qr-scanner
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the app**
   ```bash
   npm start
   ```

   Then choose:
   - `a` for Android
   - `i` for iOS
   - `w` for Web

## Project Structure

```
qr-scanner/
├── App.js                          # Main app component with navigation
├── app.json                        # Expo configuration with permissions
├── package.json                    # Dependencies
├── src/
│   └── screens/
│       ├── ScannerScreen.js       # QR code scanner UI
│       └── HistoryScreen.js       # Scan history UI
└── README.md
```

## Technologies Used

- **React Native** - Cross-platform mobile development
- **Expo** - Managed React Native framework
- **expo-camera** - Camera access and QR scanning
- **expo-image-picker** - Photo gallery access
- **expo-sharing** - Share functionality
- **React Navigation** - Bottom tab navigation
- **AsyncStorage** - Local data persistence

## Usage

### Scanning QR Codes
1. Open the Scanner tab
2. Point camera at a QR code
3. App will automatically detect and display the result
4. Share or copy the result using action buttons

### Viewing History
1. Open the History tab
2. See all previously scanned QR codes
3. Tap the share button to share a result
4. Tap the trash button to delete an item
5. Use "Clear All History" to remove all entries

## Future Enhancements

- [ ] Barcode scanning support (not just QR)
- [ ] QR code generation feature
- [ ] Advanced history search
- [ ] Export history to CSV/JSON
- [ ] Custom result filtering
- [ ] Dark mode support
- [ ] Batch scanning

## License

MIT License - feel free to use this project for your own purposes.

## Support

For issues or questions, please create an issue in the GitHub repository.
