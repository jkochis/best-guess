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

1. Install dependencies:
```bash
npm install
```

### Running the App

1. Start the development server:
```bash
npm run dev
```

2. Open your browser and navigate to the URL shown (usually `http://localhost:5173`)

### Building for Production

1. Build the app:
```bash
npm run build
```

2. Preview the build:
```bash
npm run preview
```

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

- **Svelte 5**: Logic and UI components
- **Vite**: Build tool and dev server
- **jsPDF**: Client-side PDF generation
- **vite-plugin-pwa**: Offline functionality and installability
- **LocalStorage**: Data persistence

### File Structure

```
best-guess/
├── src/
│   ├── components/     # UI Components (BusinessInfo, LineItems, etc.)
│   ├── lib/
│   │   ├── stores.js   # State management
│   │   └── pdf.js      # PDF generation logic
│   ├── App.svelte      # Main application component
│   └── app.css         # Global styles
├── public/             # Static assets
├── legacy/             # Archived Vanilla JS version
├── index.html          # Entry point
└── vite.config.js      # Build configuration
```

## License

MIT License - feel free to use and modify for your business needs.
