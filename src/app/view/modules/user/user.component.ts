import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Staff} from "../../../entity/staff";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatSelectionList, MatSelectionListChange} from "@angular/material/list";
import {Userstatus} from "../../../entity/userstatus";
import {Role} from "../../../entity/role";
import {MatTableDataSource} from "@angular/material/table";
import {User} from "../../../entity/user";
import {MatPaginator} from "@angular/material/paginator";
import {DatePipe} from "@angular/common";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {MatDialog} from "@angular/material/dialog";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import {Userrole} from "../../../entity/userrole";
import {UiAssist} from "../../../util/ui.assist/ui.assist";
import {Staffservice} from "../../../service/staffservice";
import {Userstatusservice} from "../../../service/userstatusservice";
import {Roleservice} from "../../../service/roleservice";
import {Userservice} from "../../../service/userservice";
import {Usertypeservice} from "../../../service/usertypeservice";
import {Regexservice} from "../../../service/regexservice";
import {Teacherservice} from "../../../service/teacherservice";
import {Teacher} from "../../../entity/teacher";
import {Usertype} from "../../../entity/usertype";
import {Grade} from "../../../entity/grade";
import {Gradetype} from "../../../entity/gradetype";
import {Gradetypeservice} from "../../../service/gradetypeservice";
import {Gradeservice} from "../../../service/gradeservice";
import {AuthorizationManager} from "../../../service/authorizationmanager";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit{

  public form!: FormGroup;
  public ssearch!: FormGroup;
  public csearch!: FormGroup;

  staffs: Array<Staff> = [];
  userss : Array<User> = [];
  gradetypes: Array<Gradetype> = [];
  grades: Array<Grade> = [];
  teachers: Array<Teacher> = [];
  userstatues: Array<Userstatus> = [];
  usertypes: Array<Usertype> = [];
  users: any[] = [];
  userroles: Array<Userrole> = [];

  @Input()roles: Array<Role> = [];
  oldroles:Array<Role>=[];
  @Input()selectedroles: Array<Role> =[];


  user!:User;
  olduser!:User;

  @ViewChild('availablelist') availablelist!: MatSelectionList;
  @ViewChild('selectedlist') selectedlist!: MatSelectionList;

  imgeTeachurl: string = 'assets/userold.png';

  columns: string[] = ['username','grade', 'docreated', 'userstatus','role','description','toreated'];
  headers: string[] = [ 'Username', 'User-Grade','DoCreated', 'Status','Role','Description','To Ceated'];
  binders: string[] = ['username','getGrade()', 'getDate()', 'userstatus.name','getRole()','description','tocreated'];

  cscolumns: string[] = ['csusername', 'csdocreated', 'csuserstatus','csuserroles'];
  csprompts: string[] = ['Search by Username', 'Search by DoCreated','Search by User Status','Search by User Roles'];

  imageurl: string = '';

  data !:MatTableDataSource<User>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  selectedrow: any;

  uiassist: UiAssist;

  regexes:any;

  enaadd:boolean = false;
  enaupd:boolean = false;
  enadel:boolean = false;


  constructor(
    private fb:FormBuilder,
    private staffservice:Staffservice,
    private teacherservice:Teacherservice,
    private userstatusservice:Userstatusservice,
    private usertypeservice:Usertypeservice,
    private roleservice:Roleservice,
    private userservice:Userservice,
    private gradetypeservice:Gradetypeservice,
    private gradeservice:Gradeservice,
    private dp:DatePipe,
    private dg:MatDialog,
    private regexservice:Regexservice,
    public authService:AuthorizationManager
  ) {

    this.uiassist = new UiAssist(this);
    // @ts-ignore
    this.user = new User();

    this.csearch = this.fb.group({
      "csusername": new FormControl(),
      "csdocreated": new FormControl(),
      "csuserstatus": new FormControl(),
      "csuserroles": new FormControl(),

    });
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];

    this.form = this.fb.group({
      "usertype": new FormControl('',[Validators.required]),
      'grade': new FormControl('',[Validators.required]),
      'gradetype': new FormControl('',[Validators.required]),
      'user': new FormControl('',[Validators.required]),
      "staff": new FormControl(),
      "teacher": new FormControl(),
      "username": new FormControl({value: null, disabled: false},[Validators.required]),
      "password": new FormControl('',[Validators.required]),
      "confirmpassword": new FormControl('',[Validators.required]),
      "docreated": new FormControl({value: formattedDate, disabled: false},[Validators.required]),
      "tocreated": new FormControl({value: this.dp.transform(Date.now(),"hh:mm:ss"), disabled: false},[Validators.required]),
      "userstatus": new FormControl('',[Validators.required]),
      "description": new FormControl(),
      "userroles": new FormControl('',[Validators.required]),
      "photo": new FormControl(),

    });

    this.ssearch = this.fb.group({
      "ssStatus": new FormControl(),
      "ssrole": new FormControl(),
    });

  }


  ngOnInit(): void{
    this.initialize();
  }


  initialize(){

    this.createView();

    this.userstatusservice.getAllList().then((usts:Userstatus[]) => {
      this.userstatues = usts;
    });

    this.usertypeservice.getAllList().then((usts:Usertype[]) => {
      this.usertypes = usts;
      console.log(this.usertypes)
    });

    this.roleservice.getAllList().then((rlse:Role[])=>{
      this.roles = rlse;
      this.oldroles = Array.from(this.roles);
    });

    this.regexservice.get("user").then((regs:[])=>{
      this.regexes = regs;
      this.createForm();
    });

  }

  selectImage(e:any): void{
    if (e.target.files){
      let reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload=(event:any)=>{this.imgeTeachurl = event.target.result;
        this.form.controls['photo'].clearValidators();
      }
    }
  }

  clearImage():void{
    this.imgeTeachurl='assets/userold.png';
  }

  createView() {
    this.imageurl = 'assets/pending.gif';
    this.loadTable("");
  }

  loadTable(query:string):void{

    this.userservice.getAll(query)
      .then((usrs: User[]) => {
        this.users = usrs;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.users);
        this.data.paginator = this.paginator;
      });

  }

//get userid
  loadUser(id: number) {
    // console.log(id);

    if (id == 1){
      this.gradetypeservice.getbyUserStaffsecgrade().then((grd: Gradetype[]) =>{
        this.gradetypes = grd ;
      });
    }else {
      this.gradetypeservice.getbygradetype().then((grd: Gradetype[]) =>{
        this.gradetypes = grd ;
      });
    }
  }
  //Grade loads
  loadGrade(id: number) {
    this.gradeservice.getById(id).then((grades: Grade[]) =>{this.grades = grades;});
  }
  //Employee load
  loadStaff(id: number) {
    console.log(id);
    if (id == 1 || id <= 20) {
      // @ts-ignore
      this.staffservice.getByStaffId(id).then((staff: Staff[]) => {
        this.users = staff;
        if (staff.length > 0) {
          this.user.staff = staff[0]; // Assign the first staff element to the staff property of the user
        }
        console.log(this.users);
      });
    } else {
      this.teacherservice.getById(id).then((tech: Teacher[]) => {
        this.users = tech;
        this.teachers = tech; // Set the 'teachers' array with the loaded teacher data
        if (tech.length > 0) {
          this.user.teacher = tech[0]; // Assign the first teacher element to the staff property of the user
        }
        console.log(this.users);
      });
    }
  }

  clearMainForm(){
    const today = new Date();
    console.log( today.toISOString())
    const formattedDate = today.toISOString().split("T")[0];

    // @ts-ignore
    this.olduser = undefined;
    this.form.controls['usertype'].reset();
    this.form.controls['grade'].reset();
    this.form.controls['gradetype'].reset();
    this.form.controls['user'].reset();
    this.form.controls['staff'].reset();
    this.form.controls['teacher'].reset();
    this.form.controls['username'].reset();
    this.form.controls['password'].reset();
    this.form.controls['confirmpassword'].reset();
    this.form.controls['userstatus'].reset();
    this.form.controls['description'].reset();
    this.form.controls['docreated'].setValue(formattedDate);
    this.form.controls['userroles'].reset();
    this.form.controls['photo'].reset();

    this.leftAll();
    this.userroles=[];

  }
  getDate(element: User) {
    return this.dp.transform(element.docreated,'yyyy-MM-dd');
  }


  getRole(element:User){
    let roles = "";
    element.userroles.forEach((e)=>{ roles = roles+e.role.name+","+"\n"; });
    return roles;

  }

  // @ts-ignore
  getGrade(element:User){

    if (element.teacher != null){
      return element.teacher.grade.name;
    }else {
      return element.staff.grade.name;
    }

  }


  createForm() {
    this.form.controls['userstatus'].setValidators([Validators.required]);
    this.form.controls['gradetype']?.setValidators([Validators.required]);
    this.form.controls['grade']?.setValidators([Validators.required]);
    this.form.controls['staff'].setValidators([]);
    this.form.controls['teacher'].setValidators([]);
    this.form.controls['username'].setValidators([Validators.required, Validators.pattern(this.regexes['username']['regex'])]);
    this.form.controls['password'].setValidators([Validators.required]);
    this.form.controls['confirmpassword'].setValidators([Validators.required]);
    this.form.controls['docreated'].setValidators([Validators.required]);
    this.form.controls['tocreated'].setValidators([Validators.required]);
    this.form.controls['description'].setValidators([Validators.pattern(this.regexes['description']['regex'])]);
    this.form.controls['userroles'].setValidators([Validators.required]);
    Object.values(this.form.controls).forEach( control => { control.markAsTouched(); } );

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {
          // @ts-ignore
          if ( controlName == "docreated")
            value = this.dp.transform(new Date(value), 'yyyy-MM-dd');

          if (this.olduser != undefined && control.valid) {
            // @ts-ignore
            if (value === this.user[controlName]) {
              control.markAsPristine();
            } else {
              control.markAsDirty();
            }
          } else {
            control.markAsPristine();
          }
        }
      );

    }

    this.enableButtons(true,false,false);

  }



  enableButtons(add:boolean, upd:boolean, del:boolean){
    this.enaadd=add;
    this.enaupd=upd;
    this.enadel=del;
  }

  rightSelected(): void {

    this.user.userroles = this.availablelist.selectedOptions.selected.map(option => {
      // @ts-ignore
      const userRole = new Userrole(option.value);
      this.roles = this.roles.filter(role => role !== option.value); //Remove Selected
      this.userroles.push(userRole); // Add selected to Right Side
      return userRole;
    });

    this.form.controls["userroles"].clearValidators();
    this.form.controls["userroles"].updateValueAndValidity(); // Update status

  }

  leftSelected(): void {
    const selectedOptions = this.selectedlist.selectedOptions.selected; // Right Side
    for (const option of selectedOptions) {
      const extUserRoles = option.value;
      this.userroles = this.userroles.filter(role => role !== extUserRoles); // Remove the Selected one From Right Side
      this.roles.push(extUserRoles.role)
    }
  }

  rightAll(): void {
    this.user.userroles = this.availablelist.selectAll().map(option => {
      // @ts-ignore
      const userRole = new Userrole(option.value);
      this.roles = this.roles.filter(role => role !== option.value);
      this.userroles.push(userRole);
      return userRole;
    });

    this.form.controls["userroles"].clearValidators();
    this.form.controls["userroles"].updateValueAndValidity();
  }
  leftAll():void{
    for(let userrole of this.userroles) this.roles.push(userrole.role);
    this.userroles = [];
  }


  filterTable(): void {
    const cserchdata = this.csearch.getRawValue();

    this.data.filterPredicate = (user: User, filter: string) => {
      return (cserchdata.csusername == null || user.username.toLowerCase().includes(cserchdata.csusername)) &&
        (cserchdata.csdocreated == null || user.docreated.toLowerCase().includes(cserchdata.csdocreated)) &&
        (cserchdata.csuserstatus == null || user.userstatus.name.toLowerCase().includes(cserchdata.csuserstatus))&&
        (cserchdata.csuserroles == null || user.userroles[0].role.name.toLowerCase().includes(cserchdata.csuserroles))
    };

    this.data.filter = 'xx';

  }
  btnSearchMc(): void {
    const sserchdata = this.ssearch.getRawValue();

    let statusid = sserchdata.ssStatus;
    let roleid = sserchdata.ssrole;
    let query = "";

    if (statusid != null) query = query + "&statusid=" + statusid;
    if (roleid != null) query = query + "&roleid=" + roleid;

    if (query != "") query = query.replace(/^./, "?")

    this.loadTable(query);
  }


  btnSearchClearMc(): void {

    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {heading: "Search Clear", message: "Are you sure to Clear the Search?"}
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.ssearch.reset();
        this.loadTable("");
      }
    });

  }


  getErrors(): string {

    let errors: string = ""

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];

      if (control.errors) {

        if (this.regexes[controlName] != undefined) {
          errors = errors + "<br>" + this.regexes[controlName]['message'];
        } else {
          errors = errors + "<br>Invalid " + controlName;
        }
      }
    }

    if(this.form.controls['password'].getRawValue() != this.form.controls['confirmpassword'].getRawValue())
      errors = errors + "<br> Password doesn't Match";

    return errors;
  }


  add() {
    console.log(this.form.controls['usertype'].value.name == 'Teacher')

    let errors = this.getErrors();

    if (errors != "") {
      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - User Add ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {

      const user:User = this.form.getRawValue();
      console.log(user)
      // @ts-ignore

      console.log(this.form.getRawValue())


      console.log(user)
      // @ts-ignore
      delete user.confirmpassword;
      // @ts-ignore

      // console.log(user);
      user.userroles = this.user.userroles;
      console.log("-----------------")
      console.log(user.userroles)
      console.log("-----------------")
      user.staff = this.user.staff;
      console.log("-----------------")
      console.log(user.staff)
      console.log("-----------------")
      user.teacher = this.user.teacher;
      console.log(user.teacher)
      this.user = user;


      let usrdata: string = "";

      usrdata = usrdata + "<br>Employee Name is : " + this.users[0].fullname;

      usrdata = usrdata + "<br>Password is : " + this.user.password;

      const confirm = this.dg.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - User Add",
          message: "Are you sure to Add the folowing User? <br> <br>" + usrdata
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";

      confirm.afterClosed().subscribe(async result => {
        if (result) {
          // console.log("StaffService.add(emp)");

          console.log(JSON.stringify(this.user));
          this.userservice.add(this.user).then((responce: [] | undefined) => {
            //console.log("Res-" + responce);
            //console.log("Un-" + responce == undefined);
            if (responce != undefined) { // @ts-ignore
              console.log("Add-" + responce['id'] + "-" + responce['url'] + "-" + (responce['errors'] == ""));
              // @ts-ignore
              addstatus = responce['errors'] == "";
              console.log("Add Sta-" + addstatus);
              if (!addstatus) { // @ts-ignore
                addmessage = responce['errors'];
              }
            } else {
              console.log("undefined");
              addstatus = false;
              addmessage = "Content Not Found"
            }
          }).finally(() => {

            if (addstatus) {
              addmessage = "Successfully Saved";
              this.clearMainForm();
              this.userroles = [];
              this.clearImage();
              Object.values(this.form.controls).forEach(control => {
                control.markAsTouched();
              });
              this.loadTable("");
            }

            const stsmsg = this.dg.open(MessageComponent, {
              width: '500px',
              data: {heading: "Status -User Add", message: addmessage}
            });

            stsmsg.afterClosed().subscribe(async result => {
              if (!result) {
                return;
              }
            });
         });
        }
      });
    }
  }


  fillForm(user: User) {

    this.form.controls['username'].disable();
    this.form.controls['tocreated'].disable();
    this.form.controls['docreated'].disable();

    this.selectedrow=user;

    this.enableButtons(false,true,true);
    this.roles = Array.from(this.oldroles);

    this.user = JSON.parse(JSON.stringify(user));
    this.olduser = JSON.parse(JSON.stringify(user));



    //@ts-ignore
    this.user.usertype = this.usertypes.find(e => e.id === this.user.usertype.id);

    if (user.usertype.id == 1){

      if (this.user.staff.photo != null){
        this.imgeTeachurl = atob(this.user.staff.photo);
        this.form.controls['photo'].clearValidators();
      }else {
        this.clearImage();
      }

      this.user.staff.photo = "";

      this.gradetypeservice.getbyUserStaffsecgrade().then((grd: Gradetype[]) =>{
        this.gradetypes = grd ;
        // @ts-ignore
        this.user.gradetype = this.gradetypes.find(e => e.id === this.user.staff.grade.gradetype.id);
        this.user.grade =  this.user.staff.grade;
        console.log()
        // this.gradetypes.push(this.user.gradetype);
        this.grades.push(this.user.grade);

        // @ts-ignore
        this.staffservice.getByStaffId(this.user.grade.id).then((tech: Staff[]) => {
          this.users = tech;
          console.log( this.user.staff.id)
          console.log(this.users.find(e => e.id))
          // @ts-ignore
          this.user.user = this.users.find(e => e.id === this.user.staff.id);
          // @ts-ignore
          this.user.userstatus = this.userstatues.find(s => s.id === this.user.userstatus.id);

          this.userroles = this.user.userroles; // Load User Roles

          this.user.userroles.forEach((ur)=> this.roles = this.roles.filter((r)=> r.id != ur.role.id )); // Load or remove roles by comparing with user.userroles

          this.form.patchValue(this.user);
          // this.form.controls["username"].disable();
          this.form.markAsPristine();
        });
      });
    }else {

      this.gradetypeservice.getbygradetype().then((grd: Gradetype[]) =>{
        this.gradetypes = grd ;
        // @ts-ignore
        this.user.gradetype = this.gradetypes.find(e => e.id === this.user.teacher.grade.gradetype.id);
        this.user.grade =  this.user.teacher.grade;
        console.log()
        // this.gradetypes.push(this.user.gradetype);
        this.grades.push(this.user.grade);


        // @ts-ignore
        this.teacherservice.getById(this.user.grade.id).then((tech: Teacher[]) => {
          this.users = tech;
          console.log( this.user.teacher.id)
          console.log(this.users.find(e => e.id))
          // @ts-ignore
          this.user.user = this.users.find(e => e.id === this.user.teacher.id);
          //@ts-ignore
          this.user.userstatus = this.userstatues.find(s => s.id === this.user.userstatus.id);

          this.userroles = this.user.userroles; // Load User Roles

          this.user.userroles.forEach((ur)=> this.roles = this.roles.filter((r)=> r.id != ur.role.id )); // Load or remove roles by comparing with user.userroles

          this.form.patchValue(this.user);
          // this.form.controls["username"].disable();
          this.form.markAsPristine();
        });
      });
    }
  }

  getUpdates(): string {

    let updates: string = "";
    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      if (control.dirty) {
        updates = updates + "<br>" + controlName.charAt(0).toUpperCase() + controlName.slice(1)+" Changed";
      }
    }
    return updates;
  }

  update() {

    let errors = this.getErrors();

    if (errors != "") {

      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - User Update ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

    } else {

      let updates: string = this.getUpdates();

      if (updates != "") {

        let updstatus: boolean = false;
        let updmessage: string = "Server Not Found";

        const confirm = this.dg.open(ConfirmComponent, {
          width: '500px',
          data: {
            heading: "Confirmation - Staff Update",
            message: "Are you sure to Save folowing Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {
            //console.log("StaffService.update()");
            this.user = this.form.getRawValue();
            console.log(this.user);
            this.userservice.update(this.user).then((responce: [] | undefined) => {
              //console.log("Res-" + responce);
              // console.log("Un-" + responce == undefined);
              if (responce != undefined) { // @ts-ignore
                //console.log("Add-" + responce['id'] + "-" + responce['url'] + "-" + (responce['errors'] == ""));
                // @ts-ignore
                updstatus = responce['errors'] == "";
                //console.log("Upd Sta-" + updstatus);
                if (!updstatus) { // @ts-ignore
                  updmessage = responce['errors'];
                }
              } else {
                //console.log("undefined");
                updstatus = false;
                updmessage = "Content Not Found"
              }
            } ).finally(() => {
              if (updstatus) {
                updmessage = "Successfully Updated";
                this.form.controls['tocreated'].enable();
                this.form.controls['username'].enable();
                this.form.controls['docreated'].enable();
                this.clearMainForm();
                this.leftAll();
                Object.values(this.form.controls).forEach(control => { control.markAsTouched(); });
                this.loadTable("");
              }
              const stsmsg = this.dg.open(MessageComponent, {
                width: '500px',
                data: {heading: "Status -Staff Add", message: updmessage}
              });
              stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

            });
          }
        });
      }
      else {

        const updmsg = this.dg.open(MessageComponent, {
          width: '500px',
          data: {heading: "Confirmation - Staff Update", message: "Nothing Changed"}
        });
        updmsg.afterClosed().subscribe(async result => { if (!result) { return; } });
      }
    }
  }


  delete() : void {

    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - User Delete",
        message: "Are you sure to Delete following User? <br> <br>" + this.user.username
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        // @ts-ignore
        this.userservice.delete(this.user.username).then((responce: [] | undefined) => {

          if (responce != undefined) { // @ts-ignore
            delstatus = responce['errors'] == "";
            if (!delstatus) { // @ts-ignore
              delmessage = responce['errors'];
            }
          } else {
            delstatus = false;
            delmessage = "Content Not Found"
          }
        }).finally(() => {
          if (delstatus) {
            delmessage = "Successfully Deleted";
            this.clearMainForm();
            this.clearImage();
            this.form.controls['tocreated'].enable();
            this.form.controls['username'].enable();
            this.form.controls['docreated'].enable();
            Object.values(this.form.controls).forEach(control => {
              control.markAsTouched();
            });
            this.loadTable("");
          }
          const stsmsg = this.dg.open(MessageComponent, {
            width: '500px',
            data: {heading: "Status - User Delete ", message: delmessage}
          });
          stsmsg.afterClosed().subscribe(async result => {
            if (!result) {
              return;
            }
          });

        });
      }
    });
  }

  //Clear Button

  clearForm() {
    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Clear Form",
        message: "Are you sure to Clear folowing Data ? <br> <br>"
      }
    });
    confirm.afterClosed().subscribe(async result =>{
      if (result){
        this.clearMainForm();
        this.form.controls['tocreated'].enable();
        this.form.controls['username'].enable();
        this.form.controls['docreated'].enable();
        this.clearImage()
        Object.values(this.form.controls).forEach(control => {
          control.markAsTouched();
        });
        this.enableButtons(true,false,false);
        this.loadTable("");
      }
    });
  }
}
