# Custom Fonts Setup

This directory contains custom fonts for the website.

## Adding Your Custom Font

1. **Extract your font files** from the zip file into this directory
2. **Convert to WOFF2 format** (recommended for web):
   - Use online converters like [CloudConvert](https://cloudconvert.com/) or [FontSquirrel](https://www.fontsquirrel.com/tools/webfont-generator)
   - Or use command line tools like `woff2_compress`

3. **Update the font configuration** in `custom-fonts.ts`:
   - Replace `your-custom-font-regular.woff2` with your actual font filename
   - Replace `your-custom-font-bold.woff2` with your bold font filename
   - Add additional weights/styles as needed

4. **Example configuration**:
   ```typescript
   export const headingFont = localFont({
     src: [
       {
         path: './MyCustomFont-Regular.woff2',
         weight: '400',
         style: 'normal',
       },
       {
         path: './MyCustomFont-Bold.woff2',
         weight: '700',
         style: 'normal',
       },
     ],
     variable: '--font-heading',
     display: 'swap',
   });
   ```

## Using the Fonts

- **Body text**: Uses Nunito (Google Fonts) automatically
- **Headings**: Use the `font-heading` class or `font-heading` Tailwind utility
- **Display text**: Use the `font-display` class or `font-display` Tailwind utility

## Example Usage

```jsx
<h1 className="font-heading text-4xl font-bold">Custom Font Heading</h1>
<p className="font-sans">Nunito body text</p>
```

## Supported Font Formats

- **WOFF2** (recommended - smallest file size)
- **WOFF** (good fallback)
- **TTF/OTF** (larger files, use as fallback)

## Performance Tips

1. Use WOFF2 format for best compression
2. Only include the font weights you actually use
3. Use `display: 'swap'` for better loading performance
4. Consider preloading critical fonts 