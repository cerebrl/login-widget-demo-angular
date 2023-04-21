import { Component, OnInit } from '@angular/core';
import Widget, {
  component,
  configuration,
  journey,
  user,
} from '@forgerock/login-widget';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'login-widget-angular';

  config: ReturnType<typeof configuration> | undefined;
  componentEvents: ReturnType<typeof component> | undefined;
  journeyEvents: ReturnType<typeof journey> | undefined;

  unsubJourneyEvents: () => void = () => {};

  userInfo: any;

  ngOnInit(): void {
    this.config = configuration();
    this.componentEvents = component();
    this.journeyEvents = journey();

    this.config.set({
      forgerock: {
        serverConfig: {
          baseUrl: 'https://openam-crbrl-01.forgeblocks.com/am',
          timeout: 3000,
        },
      },
    });

    this.unsubJourneyEvents = this.journeyEvents?.subscribe((event) => {
      if (this.userInfo !== event.user.response) {
        this.userInfo = event.user.response;
      }
    });

    const widgetRootEl = document.getElementById(
      'widget-root'
    ) as HTMLDivElement;

    new Widget({ target: widgetRootEl });
  }

  ngOnDestroy(): void {
    this.unsubJourneyEvents();
  }

  login(): void {
    this.journeyEvents?.start();
    this.componentEvents?.open();
  }

  logout(): void {
    user.logout();
  }
}
