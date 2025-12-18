# Best Guess - Home Repair Estimate Generator

A Progressive Web App for creating professional home repair estimates and generating beautiful PDFs for customers.

## Features

- Modern, responsive design that works on desktop and mobile
- Progressive Web App - can be installed on devices and works offline
- Easy-to-use form for estimate creation
- Dynamic line items with automatic calculations
- Configurable tax rates
- Professional PDF generation
- Email integration for sending estimates to customers
- Local storage for business information (never lose your details)
- Auto-incrementing estimate numbers
- Dark mode support

## Getting Started

### Installation

1. Install dependencies (optional, only needed for development server):
```bash
npm install -g serve
```

### Running the App

1. Start the development server:
```bash
npm start
```

2. Open your browser and navigate to `http://localhost:3000`

3. For production, simply host the files on any web server or use services like:
   - Netlify
   - Vercel
   - GitHub Pages
   - Any static hosting service

### Installing as PWA

Once the app is running:

1. On desktop: Look for the install icon in your browser's address bar
2. On mobile: Use the "Add to Home Screen" option in your browser menu
3. The app will then work offline and can be accessed like a native app

## Usage

### First Time Setup

1. Fill in your business information (name, email, phone, address)
2. This information is automatically saved to your browser's local storage
3. You won't need to enter it again for future estimates

### Creating an Estimate

1. Fill in customer information
2. Enter project details
3. Add line items by clicking "+ Add Item"
   - Description: What work will be done
   - Qty: Quantity or hours
   - Rate: Price per unit
   - Amount: Automatically calculated
4. Set tax rate if applicable
5. Add any notes or terms

### Generating PDF

Click "Generate PDF" to download a professional-looking PDF estimate.

The PDF includes:
- Your business information
- Customer details
- Itemized work breakdown
- Subtotal, tax, and total
- Notes and terms

### Emailing to Customer

Click "Email to Customer" to:
- Open your default email client with a pre-filled message
- Download the PDF to attach to the email

Note: Due to browser limitations, PDFs can't be automatically attached. The app will open your email client and download the PDF for you to attach manually.

### Clearing Form

After completing an estimate, use "Clear Form" to:
- Reset customer and project information
- Clear line items
- Auto-increment the estimate number
- Keep your business information saved

## Technical Details

### Technologies Used

- HTML5, CSS3, JavaScript (Vanilla)
- jsPDF for PDF generation
- Service Worker for offline functionality
- Web App Manifest for PWA capabilities
- LocalStorage for data persistence

### Browser Support

Works in all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers

### Offline Functionality

Once loaded, the app works completely offline thanks to service worker caching. This means you can:
- Create estimates without internet
- Generate PDFs offline
- Access previously saved business information

## File Structure

```
best-guess/
├── index.html          # Main HTML structure
├── app.js              # Application logic
├── styles.css          # Styling and responsive design
├── manifest.json       # PWA configuration
├── service-worker.js   # Offline functionality
├── package.json        # Project metadata
└── README.md          # This file
```

## Customization

### Changing Colors

Edit the CSS variables in `styles.css`:

```css
:root {
    --primary-color: #2563eb;  /* Main brand color */
    --secondary-color: #64748b; /* Secondary actions */
    /* ... more variables */
}
```

### Modifying PDF Layout

Edit the `generatePDF()` function in `app.js` to customize:
- Font sizes and colors
- Layout and positioning
- Additional fields
- Logo or branding

### Adding Fields

1. Add input fields in `index.html`
2. Update `getFormData()` in `app.js` to include new fields
3. Modify `generatePDF()` to display the new information

## Tips

- Use consistent estimate numbering (e.g., EST-001, EST-002)
- Set your valid until date to give customers time to review
- Be detailed in line item descriptions
- Include payment terms and warranty info in notes
- Save frequently used line items as templates

## License

MIT License - feel free to use and modify for your business needs.
