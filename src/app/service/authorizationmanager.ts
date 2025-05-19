import {Injectable} from '@angular/core';
import {AuthoritySevice} from './authoritysevice';
import {Userservice} from "./userservice";
import {User} from "../entity/user";

@Injectable()
export class AuthorizationManager {
  private readonly localStorageUsreName = 'username';
  private readonly localStoragePhoto = 'photo';
  private readonly localStorageButtonKey = 'buttonState';
  private readonly localStorageSubjectMenu = 'SubjectmenueState';
  private readonly localStorageSchoolMenu = 'SchoolmenueState';
  private readonly localStorageMemberMenu = 'MembermenueState';
  private readonly localStorageEventMenu = 'EventmenueState';
  private readonly localStorageSectionalMenu = 'SectionalmenueState';
  private readonly localStorageDivisionalMenu = 'DivisionalmenueState';
  private readonly localStorageZonalMenu = 'ZonalmenueState';
  private readonly localStorageAdminMenu = 'AdminmenuState';
  private readonly localStorageEvaluationMenu = 'EvaluationmenuState';
  public enaadd = false;
  public enaupd = false;
  public enadel = false;

  user : User | undefined;
  AdminmenuItems = [
    { name: 'User', accessFlag: true, routerLink: 'user' },
    { name: 'Privilege', accessFlag: true, routerLink: 'privilege' }
  ];

  SubjectmenuItems = [
    { name: 'Subject Register', accessFlag: true, routerLink: 'subject' },
    { name: 'Director Subject', accessFlag: true, routerLink: 'directorsubjects' },
    { name: 'Teacher Progress', accessFlag: true, routerLink: 'progress' },
    { name: 'Progress Review', accessFlag: true, routerLink: 'progress-review' },
    { name: 'Progress Performance', accessFlag: true, routerLink: 'reoprt-countbyweek' },
    { name: 'Subject Performance', accessFlag: true, routerLink: 'report-countbysubject' },
  ];


  SchoolmenuItems = [
    { name: 'School Register', accessFlag: true, routerLink: 'school' },
    { name: 'School Assign', accessFlag: true, routerLink: 'schassign' },
    { name: 'School Performance', accessFlag: true, routerLink: 'report-countbyschtype' },
  ];

  MemberRegmenuItems = [
    { name: 'Administrative Staff', accessFlag: true, routerLink: 'staff' },
    { name: 'School Staff', accessFlag: true, routerLink: 'teacher' }
  ];

  EventmenuItems = [
    { name: 'Progrram Assign', accessFlag: true, routerLink: 'program' },
    { name: 'Meeting Assign', accessFlag: true, routerLink: 'meeting' },
    { name: 'Notice', accessFlag: true, routerLink: 'notice' },
  ];

  SectionalmenuItems = [
    { name: 'Section Register', accessFlag: true, routerLink: 'section' },
    { name: 'Section Assign', accessFlag: true, routerLink: 'staffsection' },
    { name: 'Inventory Register', accessFlag: true, routerLink: 'item' },
    { name: 'Inventory Report', accessFlag: true, routerLink: 'report-countbyitemstatus' }
  ];

  DivisionalmenuItems = [
    { name: 'Division Register', accessFlag: true, routerLink: 'division' },
    { name: 'Division Assign', accessFlag: true, routerLink: 'staffdivision' },
  ];

  ZonalmenuItems = [
    { name: 'Staff Performance', accessFlag: true, routerLink: 'report-countbydesignation' }
  ];

  EvaluationmenuItems = [
    { name: 'Feedback Request', accessFlag: true, routerLink: 'review' },
    { name: 'Links', accessFlag: true, routerLink: 'link' }
  ];
  constructor(private am: AuthoritySevice, private userservice: Userservice) {}

  enableButtons(authorities: { module: string; operation: string }[]): void {
    this.enaadd = authorities.some(authority => authority.operation === 'insert');
    this.enaupd = authorities.some(authority => authority.operation === 'update');
    this.enadel = authorities.some(authority => authority.operation === 'delete');

    // Save button state in localStorage
    localStorage.setItem(this.localStorageButtonKey, JSON.stringify({ enaadd: this.enaadd, enaupd: this.enaupd, enadel: this.enadel }));
  }
  enableMenues(modules: { module: string; operation: string }[]): void {
    // Enable Admin menu items
    this.AdminmenuItems.forEach(menuItem => {
      menuItem.accessFlag = modules.some(module => module.module.toLowerCase() === menuItem.name.toLowerCase());
    });

    //Enable Subject menu items
    this.SubjectmenuItems.forEach(menuItem => {
      menuItem.accessFlag = modules.some(module => module.module.toLowerCase() === menuItem.name.toLowerCase());
    });

    // Enable Students menu items
    this.SchoolmenuItems.forEach(menuItem => {
      menuItem.accessFlag = modules.some(module => module.module.toLowerCase() === menuItem.name.toLowerCase());
    });

    // Enable Students menu items
    this.MemberRegmenuItems.forEach(menuItem => {
      menuItem.accessFlag = modules.some(module => module.module.toLowerCase() === menuItem.name.toLowerCase());
    });

    // Enable Students menu items
    this.EventmenuItems.forEach(menuItem => {
      menuItem.accessFlag = modules.some(module => module.module.toLowerCase() === menuItem.name.toLowerCase());
    });

    // Enable Students menu items
    this.SectionalmenuItems.forEach(menuItem => {
      menuItem.accessFlag = modules.some(module => module.module.toLowerCase() === menuItem.name.toLowerCase());
    });

    // Enable Students menu items
    this.DivisionalmenuItems.forEach(menuItem => {
      menuItem.accessFlag = modules.some(module => module.module.toLowerCase() === menuItem.name.toLowerCase());
    });

    // Enable Students menu items
    this.ZonalmenuItems.forEach(menuItem => {
      menuItem.accessFlag = modules.some(module => module.module.toLowerCase() === menuItem.name.toLowerCase());
    });

    // Enable Students menu items
    this.EvaluationmenuItems.forEach(menuItem => {
      menuItem.accessFlag = modules.some(module => module.module.toLowerCase() === menuItem.name.toLowerCase());
    });

    // Save each menu state in localStorage
    localStorage.setItem(this.localStorageAdminMenu, JSON.stringify(this.AdminmenuItems));
    localStorage.setItem(this.localStorageSubjectMenu, JSON.stringify(this.SubjectmenuItems));
    localStorage.setItem(this.localStorageMemberMenu, JSON.stringify(this.MemberRegmenuItems));
    localStorage.setItem(this.localStorageEventMenu, JSON.stringify(this.EventmenuItems));
    localStorage.setItem(this.localStorageSectionalMenu, JSON.stringify(this.SectionalmenuItems));
    localStorage.setItem(this.localStorageSchoolMenu, JSON.stringify(this.SchoolmenuItems));
    localStorage.setItem(this.localStorageDivisionalMenu, JSON.stringify(this.DivisionalmenuItems));
    localStorage.setItem(this.localStorageZonalMenu, JSON.stringify(this.ZonalmenuItems));
    localStorage.setItem(this.localStorageEvaluationMenu, JSON.stringify(this.EvaluationmenuItems));

  }

  async getAuth(username: string): Promise<void> {

    this.setUsername(username);
    this.getUserPhotos(username);

    try {
      const result = await this.am.getAutorities(username);
      if (result !== undefined) {
        const authorities = result.map(authority => {
          const [module, operation] = authority.split('-');
          return { module, operation };
        });
        //console.log(authorities);

        this.enableButtons(authorities);
        this.enableMenues(authorities);

      } else {
        console.log('Authorities are undefined');
      }
    } catch (error) {
      console.error(error);
    }
  }
  // @ts-ignore
  async getUserPhotos(username: string): Promise<void> {
    try {
      const user = await this.userservice.getPhoto(username);
      console.log("Fetched users:", user);

      if (user != null) {
          if (user.staff && user.staff.photo) {
            // @ts-ignore
            this.setPhoto(atob(user.staff.photo));
            console.log("User photo:", user.staff.photo);
          } else if (user.teacher && user.teacher.photo) {
            // @ts-ignore
            this.setPhoto(atob(user.teacher.photo));
            console.log("User photo:", user.teacher.photo);
          } else {
            console.log("User data or photo property missing");
          }

      } else {
        console.log("No users found or invalid user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }



  getUsername(): string {
    return localStorage.getItem(this.localStorageUsreName) || '';
  }

  setPhoto( value: string): void {
    console.log(value);
    localStorage.setItem(this.localStoragePhoto, value);
  }

  getPhoto(): string {
    return localStorage.getItem(this.localStoragePhoto) || '';
  }

  setUsername(value: string): void {
    localStorage.setItem(this.localStorageUsreName, value);
  }

  getEnaAdd(): boolean {
    return this.enaadd;
  }

  getEnaUpd(): boolean {
    return this.enaupd;
  }

  getEnaDel(): boolean {
    return this.enadel;
  }

  initializeButtonState(): void {
    const buttonState = localStorage.getItem(this.localStorageButtonKey);
    if (buttonState) {
      const { enaadd, enaupd, enadel } = JSON.parse(buttonState);
      this.enaadd = enaadd;
      this.enaupd = enaupd;
      this.enadel = enadel;
    }
  }

  initializeMenuState(): void {
    const adminMenuState = localStorage.getItem(this.localStorageAdminMenu);
    const subjectMenuState = localStorage.getItem(this.localStorageSubjectMenu);
    const memberMenuState = localStorage.getItem(this.localStorageMemberMenu);
    const eventMenuState = localStorage.getItem(this.localStorageEventMenu);
    const selctionalMenuState = localStorage.getItem(this.localStorageSectionalMenu);
    const schoolMenuState = localStorage.getItem(this.localStorageSchoolMenu);
    const divisionalMenuState = localStorage.getItem(this.localStorageDivisionalMenu);
    const zonalMenuState = localStorage.getItem(this.localStorageZonalMenu);
    const evaluationMenuState = localStorage.getItem(this.localStorageEvaluationMenu);

    if (adminMenuState) {
      this.AdminmenuItems = JSON.parse(adminMenuState);
    }

    if (subjectMenuState) {
      this.SubjectmenuItems = JSON.parse(subjectMenuState);
    }

    if (memberMenuState) {
      this.MemberRegmenuItems = JSON.parse(memberMenuState);
    }

    if (eventMenuState) {
      this.EventmenuItems = JSON.parse(eventMenuState);
    }

    if (selctionalMenuState) {
      this.SectionalmenuItems = JSON.parse(selctionalMenuState);
    }
    if (divisionalMenuState) {
      this.DivisionalmenuItems = JSON.parse(divisionalMenuState);
    }

    if (zonalMenuState) {
      this.ZonalmenuItems = JSON.parse(zonalMenuState);
    }

    if (evaluationMenuState) {
      this.EvaluationmenuItems = JSON.parse(evaluationMenuState);
    }

    if (schoolMenuState) {
      this.SchoolmenuItems = JSON.parse(schoolMenuState);
    }

  }

  clearUsername(): void {
    localStorage.removeItem(this.localStorageUsreName);
  }

  clearPhoto():void{
    localStorage.removeItem(this.localStoragePhoto);
  }

  clearButtonState(): void {
    localStorage.removeItem(this.localStorageButtonKey);
  }

  clearMenuState(): void {
    localStorage.removeItem(this.localStorageAdminMenu);
    localStorage.removeItem(this.localStorageSubjectMenu);
    localStorage.removeItem(this.localStorageMemberMenu);
    localStorage.removeItem(this.localStorageEventMenu);
    localStorage.removeItem(this.localStorageSectionalMenu);
    localStorage.removeItem(this.localStorageDivisionalMenu);
    localStorage.removeItem(this.localStorageZonalMenu);
    localStorage.removeItem(this.localStorageSchoolMenu);
    localStorage.removeItem(this.localStorageEvaluationMenu);

  }

  isMenuItemDisabled(menuItem: { accessFlag: boolean }): boolean {
    return !menuItem.accessFlag;
  }
}
