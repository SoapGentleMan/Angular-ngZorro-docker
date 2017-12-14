import { ActivatedRouteSnapshot, Params, RouterStateSnapshot } from '@angular/router';
import { RouterReducerState, RouterStateSerializer } from '@ngrx/router-store';
import { createFeatureSelector, createSelector } from '@ngrx/store';

/**
 * The RouterStateSerializer takes the current RouterStateSnapshot
 * and returns any pertinent information needed. The snapshot contains
 * all information about the state of the router at the given point in time.
 * The entire snapshot is complex and not always needed. In this case, you only
 * need the URL and query parameters from the snapshot in the store. Other items could be
 * returned such as route parameters and static route data.
 */

export interface RouterStateUrl {
  url: string;
  queryParams: Params;
  breadCrumb: {
    name: string,
    url: string
  }[]; // 面包屑
  menu: string; // 当前是哪个菜单
  isMyTable: boolean; // 是否是 我的数据源 页面
}

export const initialRouterStateUrl: RouterReducerState<RouterStateUrl> = {
  navigationId: null,
  state: {
    url: '',
    queryParams: {},
    menu: '',
    isMyTable: false,
    breadCrumb: []
  }
};

// 路由
export class CustomRouterStateSerializer implements RouterStateSerializer<RouterStateUrl> {
  serialize(routerState: RouterStateSnapshot): RouterStateUrl {
    const { url } = routerState;
    const queryParams = routerState.root.queryParams;
    const { breadCrumb, menu, isMyTable } = convertRouter(routerState.root);

    // Only return an object including the URL and query params
    // instead of the entire snapshot
    return { url, queryParams, breadCrumb, menu, isMyTable };
  }
}

function convertRouter(routerRoot: ActivatedRouteSnapshot) {
  let router = { children: [routerRoot] };
  let breadCrumb = [], menu = '', isMyTable = false, url = '';
  do {
    router = router.children[0];
    const routeConfig = (router as ActivatedRouteSnapshot).routeConfig;
    url = url + (routeConfig && routeConfig.path ? '/' + (router as ActivatedRouteSnapshot).routeConfig.path : '');
    const data = (router as ActivatedRouteSnapshot).data;
    data.menu && (menu = data.menu);
    data.isMyTable && (isMyTable = data.isMyTable);
    data.name && (breadCrumb.push({
      name: data.name,
      url: url
    }));
  } while (router.children.length > 0);

  return { breadCrumb, menu, isMyTable };
}

/**
 * createFeatureSelector:
 *    The createFeatureSelector is a convenience method for returning a top level feature state. It returns a typed selector function for a feature slice of state.
 *
 * createSelector:
 *    The createSelector method returns a callback function for selecting a slice of state.
 * */
export const getRouter =
  createFeatureSelector<RouterReducerState<RouterStateUrl>>('router');

export const getRouterStateUrl = createSelector(
  getRouter,
  (state: RouterReducerState<RouterStateUrl>) => state ? state.state : initialRouterStateUrl.state
);
