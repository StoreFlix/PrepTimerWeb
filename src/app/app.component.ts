import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { Router, ActivationEnd, NavigationStart } from '@angular/router';
import { CoreService } from './core/service/core.service';
import { ResponseHeaderDetails } from './core/model/menu.model';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'AntunesRPT';
  headerDataResponse: ResponseHeaderDetails;
  currentUrl: string = '';
  access_Token: string = '';
  localStorageToken: string = '';
  userChanged: boolean = false;
  headerApiProcessing: boolean = false;

  // Controlled by isPublicPath() — both default false so no flash on public pages
  showHeaderFooter: boolean = false;
  isIndependant: boolean = false;

  private subscriptions: Subscription[] = [];

  constructor(
    private _coreService: CoreService,
    private _router: Router,
    private renderer: Renderer2,
    private location: Location
  ) {
    this.localStorageToken = localStorage.getItem('id_token') ?? '';
    localStorage.setItem('view_Token', '');
    localStorage.setItem('view_Code', '');

    // Initialise from the current URL before the first render — prevents header flash
    const path = window.location.pathname;
    this.showHeaderFooter = !this.isPublicPath(path);
    this.isIndependant    = !this.isPublicPath(path);

    this.applyTheme();
  }

  /**
   * Single source of truth for routes that use the auth/registration branded shell.
   * The global preptimer-header + nav-menu must NOT appear on these routes.
   */
  private isPublicPath(path: string): boolean {
    return (
      path === '/' ||
      path === '/registration' ||
      path.startsWith('/forgot-password') ||
      path.startsWith('/reset-password')
    );
  }

ngOnInit() {

    // Register URL-change listener ONCE — previous code re-registered on every ActivationEnd,
    // creating a new listener per navigation and leaking memory.
    this.location.onUrlChange((url: string) => {
      this.showHeaderFooter = !this.isPublicPath(url);
      this.isIndependant    = !this.isPublicPath(url);
    });

    const routeSubscription = this._router.events.subscribe(event => {

      if (event instanceof ActivationEnd) {
        this.access_Token = event.snapshot.queryParams['t'];

        if (this.access_Token)
          localStorage.setItem('id_token', this.access_Token);

        if (this.access_Token && this.localStorageToken !== this.access_Token) {
          localStorage.removeItem('header_details');
          this.userChanged = true;
        }

        const url = event.snapshot.url;

        // Special case: report viewer hides nav
        if (url.length >= 3 &&
            url[0].toString() === 'reports' &&
            url[1].toString() === 'view') {
          const code = url[2].toString();
          if (isNaN(Number(code))) {
            this.isIndependant = false;
            localStorage.setItem('view_Code', code);
          }
        }

        // Load header/menu data only for authenticated app routes
        const headerDetails = localStorage.getItem('header_details');
        if (headerDetails && !this.userChanged) {
          this.headerDataResponse = JSON.parse(headerDetails);
        } else if (!this.headerApiProcessing && url.length > 0 &&
                   !this.isPublicPath('/' + url[0].toString())) {
          this.getHeaderDetails();
        }

        this.userChanged = false;

        const viewCode = localStorage.getItem('view_Code');
        if (viewCode && viewCode.length > 0) {
          localStorage.removeItem('id_token');
          localStorage.removeItem('header_details');
        }
      }

      if (event instanceof NavigationStart) {
        setTimeout(() => { this.currentUrl = event.url; });
      }
    });

    this.subscriptions.push(routeSubscription);
  }

  getHeaderDetails() {
    this.headerApiProcessing = true;
    if (localStorage.getItem('view_Code') === '') {
      const sub = this._coreService.getHeaderData().subscribe({
        next: (res) => {
          if (res) {
            this.headerDataResponse = res;
            localStorage.setItem('header_details', JSON.stringify(res));
          }
          this.headerApiProcessing = false;
        },
        error: () => { this.headerApiProcessing = false; }
      });
      this.subscriptions.push(sub);
    }
  }

  private applyTheme() {
    const link = this.renderer.createElement('link');
    this.renderer.setAttribute(link, 'rel', 'stylesheet');
    this.renderer.setAttribute(link, 'href', 'assets/themes/skin-blue.css');
    this.renderer.appendChild(document.head, link);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
