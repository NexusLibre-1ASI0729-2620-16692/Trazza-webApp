import {Routes} from '@angular/router';
import {iamGuard} from '../../iam/infrastructure/iam.guard';

const returnRouteList = () => import('./views/return-route-list/return-route-list').then(m => m.ReturnRouteList);
const returnRouteForm = () => import('./views/return-route-form/return-route-form').then(m => m.ReturnRouteForm);
const loadSuggestions = () => import('./views/load-suggestions/load-suggestions').then(m => m.LoadSuggestions);
const loadDetail = () => import('./views/load-detail/load-detail').then(m => m.LoadDetail);
const freightRequestList = () => import('./views/freight-request-list/freight-request-list').then(m => m.FreightRequestList);
const freightRequestForm = () => import('./views/freight-request-form/freight-request-form').then(m => m.FreightRequestForm);
const findCarriers = () => import('./views/find-carriers/find-carriers').then(m => m.FindCarriers);
const offerList = () => import('./views/offer-list/offer-list').then(m => m.OfferList);
const offerDetail = () => import('./views/offer-detail/offer-detail').then(m => m.OfferDetail);

const carrierOnly = { roles: ['carrier'] };
const merchantOnly = { roles: ['merchant'] };

export const matchmakingRoutes: Routes = [
  { path: 'return-routes',                              loadComponent: returnRouteList,    title: 'option.return-routes',      canActivate: [iamGuard], data: carrierOnly },
  { path: 'return-routes/new',                          loadComponent: returnRouteForm,    title: 'return-route.new-title',    canActivate: [iamGuard], data: carrierOnly },
  { path: 'load-suggestions',                           loadComponent: loadSuggestions,    title: 'option.load-suggestions',   canActivate: [iamGuard], data: carrierOnly },
  { path: 'load-suggestions/:routeId/loads/:requestId', loadComponent: loadDetail,         title: 'load-detail.title',         canActivate: [iamGuard], data: carrierOnly },
  { path: 'freight-requests',                           loadComponent: freightRequestList, title: 'option.freight-requests',   canActivate: [iamGuard], data: merchantOnly },
  { path: 'freight-requests/new',                       loadComponent: freightRequestForm, title: 'freight-request.new-title', canActivate: [iamGuard], data: merchantOnly },
  { path: 'freight-requests/:id/edit',                  loadComponent: freightRequestForm, title: 'freight-request.edit-title',canActivate: [iamGuard], data: merchantOnly },
  { path: 'find-carriers',                              loadComponent: findCarriers,       title: 'option.find-carriers',      canActivate: [iamGuard], data: merchantOnly },
  { path: 'offers',                                     loadComponent: offerList,          title: 'option.offers',             canActivate: [iamGuard] },
  { path: 'offers/:requestId',                          loadComponent: offerDetail,        title: 'offer-detail.title',        canActivate: [iamGuard], data: merchantOnly }
];
