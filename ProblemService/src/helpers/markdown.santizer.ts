import { marked } from "marked";
import logger from "../config/logger.config";
import sanitizeHtml from "sanitize-html";
import TurndownService from "turndown";

export async function santize(markdown: string): Promise<string> {
    if(!markdown || markdown.trim() === '') {
        return '';
    }

    try {
        const convertedHtml = await marked.parse(markdown);

        const santizedHtml = sanitizeHtml(convertedHtml, {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img', 'pre', 'code' ]),
            allowedAttributes: {
                ...sanitizeHtml.defaults.allowedAttributes,
                'img': [ 'src', 'alt', 'title' ],
                "pre": [ 'class' ],
                "code": [ 'class' ],
                "a": [ 'href', 'target' ]
            },
            allowedSchemes: [ 'http', 'https' ],
            allowedSchemesByTag: {
                'img': [ 'http', 'https' ]
            },
        });

        const tds = new TurndownService();
        const santizedMarkdown = tds.turndown(santizedHtml);
        return santizedMarkdown;
    } catch (error) {
        logger.error('Error santizing markdown', error);
        return "";
    }
}