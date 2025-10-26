console.log('Summa content script loaded on:', window.location.href);

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Summa: Received message:', request);

    if (request.action === 'getPageContent') {
        try {
            // Extract main content from the page
            const content = extractPageContent();
            console.log('Summa: Extracted content length:', content.length);
            sendResponse({ content: content });
        } catch (error) {
            console.error('Summa: Error extracting page content:', error);
            sendResponse({ content: '', error: error.message });
        }
    }
    return true; // Required to use sendResponse asynchronously
});

function extractPageContent() {
    try {
        // Create a copy to avoid modifying the actual page
        const bodyClone = document.body.cloneNode(true);

        // Remove script, style, and other non-content elements
        const elementsToRemove = bodyClone.querySelectorAll(
            'script, style, noscript, iframe, svg, nav, header, footer, aside, .ad, .advertisement, [role="complementary"]'
        );
        elementsToRemove.forEach(el => el.remove());

        // Try to find the main content area
        let mainContent = bodyClone.querySelector('main, article, [role="main"], .content, #content, .post, .entry-content');

        // If no main content area found, use the entire body
        if (!mainContent) {
            mainContent = bodyClone;
        }

        // Get text content
        let text = mainContent.textContent || mainContent.innerText || '';

        // Clean up whitespace
        text = text
            .replace(/\s+/g, ' ')           // Replace multiple spaces with single space
            .replace(/\n+/g, '\n')          // Replace multiple newlines with single newline
            .replace(/\t+/g, ' ')           // Replace tabs with spaces
            .trim();

        // Limit content length to avoid token limits (roughly 12000 characters = ~3000 tokens)
        const maxLength = 12000;
        if (text.length > maxLength) {
            text = text.substring(0, maxLength) + '...';
        }

        if (!text || text.length < 10) {
            throw new Error('Not enough content found on this page');
        }

        return text;
    } catch (error) {
        console.error('Summa: Error in extractPageContent:', error);
        throw error;
    }
}
