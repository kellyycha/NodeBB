import { Express, RequestHandler, Request, Response } from 'express';
import helpers from './helpers';

const { setupPageRoute } = helpers;

interface Middleware {
    // what type?
    exposeUid: any;
    canViewUsers: any;
    ensureLoggedIn: any;
    checkAccountPermissions: any;
    redirectMeToUserslug: any;
    redirectUidToUserslug: any;
}

interface Controllers {
    accounts:{
        profile: {
            get: RequestHandler;
        };
        follow: {
            getFollowing: RequestHandler;
            getFollowers: RequestHandler;
        };
        posts: {
            getPosts: RequestHandler;
            getTopics: RequestHandler;
            getBestPosts: RequestHandler;
            getControversialPosts: RequestHandler;
            getBookmarks: RequestHandler;
            getWatchedTopics: RequestHandler;
            getIgnoredTopics: RequestHandler;
            getUpVotedPosts: RequestHandler;
            getDownVotedPosts: RequestHandler;
        };
        groups: {
            get: RequestHandler;
        };
        categories: {
            get: RequestHandler;
        };
        edit: {
            get: RequestHandler;
            username: string;
            email: string;
            password: string;
        };
        info: {
            get: RequestHandler;
        };
        settings: {
            get: RequestHandler;
        };
        uploads: {
            get: RequestHandler;
        };
        consent: {
            get: RequestHandler;
        };
        blocks: {
            getBlocks: RequestHandler;
        };
        sessions: {
            get: RequestHandler;
        };
        notifications: {
            get: RequestHandler;
        };
        chats: {
            get: RequestHandler;
            redirectToChat: any;
        };
    }
}

exports = function (app: any, name: string, middleware: any, controllers: any) {
    const middlewares = [middleware.exposeUid, middleware.canViewUsers];
    const accountMiddlewares = [
        middleware.exposeUid,
        middleware.ensureLoggedIn,
        middleware.canViewUsers,
        middleware.checkAccountPermissions,
    ];

    setupPageRoute(app, '/me', [], middleware.redirectMeToUserslug);
    setupPageRoute(app, '/me/*', [], middleware.redirectMeToUserslug);
    setupPageRoute(app, '/uid/:uid*', [], middleware.redirectUidToUserslug);

    setupPageRoute(app, `/${name}/:userslug`, middlewares, controllers.accounts.profile.get);
    setupPageRoute(app, `/${name}/:userslug/following`, middlewares, controllers.accounts.follow.getFollowing);
    setupPageRoute(app, `/${name}/:userslug/followers`, middlewares, controllers.accounts.follow.getFollowers);

    setupPageRoute(app, `/${name}/:userslug/posts`, middlewares, controllers.accounts.posts.getPosts);
    setupPageRoute(app, `/${name}/:userslug/topics`, middlewares, controllers.accounts.posts.getTopics);
    setupPageRoute(app, `/${name}/:userslug/best`, middlewares, controllers.accounts.posts.getBestPosts);
    setupPageRoute(app, `/${name}/:userslug/controversial`, middlewares, controllers.accounts.posts.getControversialPosts);
    setupPageRoute(app, `/${name}/:userslug/groups`, middlewares, controllers.accounts.groups.get);

    setupPageRoute(app, `/${name}/:userslug/categories`, accountMiddlewares, controllers.accounts.categories.get);
    setupPageRoute(app, `/${name}/:userslug/bookmarks`, accountMiddlewares, controllers.accounts.posts.getBookmarks);
    setupPageRoute(app, `/${name}/:userslug/watched`, accountMiddlewares, controllers.accounts.posts.getWatchedTopics);
    setupPageRoute(app, `/${name}/:userslug/ignored`, accountMiddlewares, controllers.accounts.posts.getIgnoredTopics);
    setupPageRoute(app, `/${name}/:userslug/upvoted`, accountMiddlewares, controllers.accounts.posts.getUpVotedPosts);
    setupPageRoute(app, `/${name}/:userslug/downvoted`, accountMiddlewares, controllers.accounts.posts.getDownVotedPosts);
    setupPageRoute(app, `/${name}/:userslug/edit`, accountMiddlewares, controllers.accounts.edit.get);
    setupPageRoute(app, `/${name}/:userslug/edit/username`, accountMiddlewares, controllers.accounts.edit.username);
    setupPageRoute(app, `/${name}/:userslug/edit/email`, accountMiddlewares, controllers.accounts.edit.email);
    setupPageRoute(app, `/${name}/:userslug/edit/password`, accountMiddlewares, controllers.accounts.edit.password);

    app.use('/.well-known/change-password', (req: Request, res: Response) => {
        res.redirect('/me/edit/password');
    });
    setupPageRoute(app, `/${name}/:userslug/info`, accountMiddlewares, controllers.accounts.info.get);
    setupPageRoute(app, `/${name}/:userslug/settings`, accountMiddlewares, controllers.accounts.settings.get);
    setupPageRoute(app, `/${name}/:userslug/uploads`, accountMiddlewares, controllers.accounts.uploads.get);
    setupPageRoute(app, `/${name}/:userslug/consent`, accountMiddlewares, controllers.accounts.consent.get);
    setupPageRoute(app, `/${name}/:userslug/blocks`, accountMiddlewares, controllers.accounts.blocks.getBlocks);
    setupPageRoute(app, `/${name}/:userslug/sessions`, accountMiddlewares, controllers.accounts.sessions.get);

    setupPageRoute(app, '/notifications', [middleware.ensureLoggedIn], controllers.accounts.notifications.get);
    setupPageRoute(app, `/${name}/:userslug/chats/:roomid?`, middlewares, controllers.accounts.chats.get);
    setupPageRoute(app, '/chats/:roomid?', [middleware.ensureLoggedIn], controllers.accounts.chats.redirectToChat);
};
