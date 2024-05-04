import {SimpleUser} from "./SimpleUser";

/**
 * Commit type.
 */
export type Commit = {
    readonly url: string;
    readonly author: SimpleUser;
    readonly committer: SimpleUser;
    readonly message: string;
    readonly tree: {
        url: string;
        sha: string;
    };
    readonly comment_count: number;
    readonly verification: {
        verified: boolean;
        reason: string;
        signature: string;
        payload: string;
    };
}
