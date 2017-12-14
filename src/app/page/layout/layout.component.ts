import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { getRouterStateUrl, RouterStateUrl } from '../../router-ngrx';
import { State } from '../../ngrx';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  animations: [
    trigger('expandAnimation', [
      state('fade', style({ opacity: 1, height: '*', overflow: 'hidden' })),
      transition('fade => void', [
        animate(150, style({ opacity: 0, height: 0, overflow: 'hidden' }))
      ]),
      transition('void => fade', [
        style({ opacity: 0, height: 0, overflow: 'hidden' }),
        animate(150, style({ opacity: 1, height: '*', overflow: 'hidden' }))
      ])
    ])
  ]
})
export class LayoutComponent implements OnInit, AfterViewInit, OnDestroy {

  routerStateUrl$: Observable<RouterStateUrl>;
  selectedSubmenu: string;
  fn;

  constructor(public store: Store<State>, private elementRef: ElementRef) {
    this.routerStateUrl$ = this.store.select(getRouterStateUrl);
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.fn = (ev) => {
      const rootMenu = this.elementRef.nativeElement.querySelectorAll('.ant-menu-submenu.ant-menu-submenu-horizontal');
      if (!Array.from(rootMenu).some((menu: EventTarget | Node) => {
          return ev.target === (menu as EventTarget) || !!((menu as Node).compareDocumentPosition(ev.target) & 16);
        })) {
        this.selectedSubmenu = '';
      }
    }
    document.body.addEventListener('click', this.fn);
  }

  ngOnDestroy() {
    document.body.removeEventListener('click', this.fn);
  }

  selectSubmenu(menu) {
    if (this.selectedSubmenu === menu) {
      this.selectedSubmenu = '';
    } else {
      this.selectedSubmenu = menu;
    }
  }
}
