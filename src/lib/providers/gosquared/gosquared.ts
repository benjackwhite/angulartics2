import { Injectable } from '@angular/core';

import { Angulartics2 } from 'angulartics2';

declare var _gs: Function;

@Injectable({ providedIn: 'root' })
export class Angulartics2GoSquared {
  constructor(private angulartics2: Angulartics2) {
    this.angulartics2.setUserProperties.subscribe(x =>
      this.setUserProperties(x)
    );
    this.angulartics2.setUserPropertiesOnce.subscribe(x =>
      this.setUserProperties(x)
    );
  }

  init(token: string) {
    // Queues commands to be run once the tracking script loads
    window['_gs'] = function() {
      (window['_gs'].q = window['_gs'].q || []).push(arguments);
    };

    const script = document.createElement('script');
    script.innerHTML = `!function(g,s,q,r,d){r=g[r]=g[r];d=s.createElement(q);q=s.getElementsByTagName(q)[0];
      d.src='//d1l6p2sc9645hc.cloudfront.net/tracker.js';q.parentNode.
      insertBefore(d,q)}(window,document,'script','_gs');
      _gs('${token}');
      _gs('set', 'anonymizeIP', true);
      _gs('set', 'trackLocal', true);`;

    document.head.appendChild(script);
  }

  startTracking(): void {
    this.angulartics2.pageTrack
      .pipe(this.angulartics2.filterDeveloperMode())
      .subscribe(x => this.pageTrack(x.path));
    this.angulartics2.eventTrack
      .pipe(this.angulartics2.filterDeveloperMode())
      .subscribe(x => this.eventTrack(x.action, x.properties));
  }

  pageTrack(path: string) {
    try {
      _gs('track', path);
    } catch (e) {
      if (!(e instanceof ReferenceError)) {
        throw e;
      }
    }
  }

  eventTrack(action: string, properties: any) {
    try {
      _gs('event', action, properties);
    } catch (e) {
      if (!(e instanceof ReferenceError)) {
        throw e;
      }
    }
  }

  setUserProperties(properties: any) {
    try {
      _gs('identify', properties);
    } catch (e) {
      if (!(e instanceof ReferenceError)) {
        throw e;
      }
    }
  }
}
