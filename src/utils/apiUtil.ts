import {FetchResponse} from "@/types/responses/FetchResponse";

/**
 * API utility functions
 */
export const apiUtil = {
    /**
     * Custom fetch function
     * @param url - URL to fetch
     * @param options - fetch options
     * @returns - response from the fetch request
     */
    customFetch(
        url: string,
        options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions,
    ): FetchResponse {
        const res = UrlFetchApp.fetch(url, options);
        return {
            status: res.getResponseCode(),
            body: res.getContentText(),
        };
    },
}