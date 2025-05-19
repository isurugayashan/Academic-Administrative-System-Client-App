import {Component, ViewChild} from '@angular/core';
import {Staff} from "../../../entity/staff";
import {Gender} from "../../../entity/gender";
import {Staffdesignation} from "../../../entity/staffdesignation";
import {Title} from "../../../entity/title";
import {Civilstatus} from "../../../entity/civilstatus";
import {Qualification} from "../../../entity/qualifications";
import {Grade} from "../../../entity/grade";
import {Gradetype} from "../../../entity/gradetype";
import {Empstatus} from "../../../entity/empstatus";
import {Officetype} from "../../../entity/officetype";
import {Staffservice} from "../../../service/staffservice";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {UiAssist} from "../../../util/ui.assist/ui.assist";
import {Genderservice} from "../../../service/genderservice";
import {Civilstatusservice} from "../../../service/civilstatusservice";
import {Empstatusservice} from "../../../service/empstatusservice";
import {Gradeservice} from "../../../service/gradeservice";
import {Officetypeservice} from "../../../service/officetypeservice";
import {Qualificationsservice} from "../../../service/qualificationservice";
import {Staffdesignationservice} from "../../../service/staffdesignationservice";
import {Titleservice} from "../../../service/titileservice";
import {Gradetypeservice} from "../../../service/gradetypeservice";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {Regexservice} from "../../../service/regexservice";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import _default from "chart.js/dist/plugins/plugin.tooltip";
import {DatePipe} from "@angular/common";
import {elements} from "chart.js";
import {elementSelectors} from "@angular/cdk/schematics";
import {error} from "@angular/compiler-cli/src/transformers/util";
import backgroundColor = _default.defaults.backgroundColor;


@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.css'],
})
export class StaffComponent {
  cols = "12";

  //Table columns
  columns: string[] = ['title','callingname','fullname','dofirstappoint','nic', 'mobile','designation','grade','gender','status', 'office','email'];
  headers: string[] = ['Title','Calling Name','Full Name','First Appointment','NIC', 'Mobile','Designation','Grade','Gender','Status', 'Office','Email'];
  binders: string[] = ['title.name','callingname','fullname','dofirstappoint','nic', 'mobile','staffdesignation.name','grade.name','gender.name','empstatus.name', 'officetype.name','email'];

  //Client Search columns
  cscolumns: string[] = ['cscallingname','csnic','csdesignation','csStatus', 'csgrade'];
  csprompts: string[] = ['Search by Calling Name','Search by NIC', 'Search by Designation', 'Search by Status', 'Search by Grade'];

  public csearch!: FormGroup;
  public ssearch!: FormGroup;
  public form!: FormGroup;

  staffObj!: Staff;
  oldstaffObj!: Staff| undefined;

  selectedRow: any;

  enaadd:boolean =false;
  enaupd:boolean =false;
  enadel:boolean =false;

  staff: Array<Staff> = [];
  imageurl : string = '';
  data!: MatTableDataSource<Staff>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  imgeStaffurl: string = 'assets/userold.png';

  //Supportive Arrays
  genders: Array<Gender> = [];
  civilstatuses: Array<Civilstatus> = [];
  empstatuses: Array<Empstatus> = [];
  grades: Array<Grade> = [];
  gradetypes: Array<Gradetype> = [];
  officetypes: Array<Officetype> = [];
  qualifications: Array<Qualification> = [];
  staffdesignations: Array<Staffdesignation> = [];
  titiles: Array<Title> = [];

  regexes: any;

  uiassist: UiAssist;

  maxDate2!: Date;

  minDate!: Date;
  maxDate!: Date;

  constructor(private ss: Staffservice,
              private fb: FormBuilder,
              private genderservice: Genderservice,
              private civilstatusservice: Civilstatusservice,
              private empstatusservice: Empstatusservice,
              private gradetypeservice: Gradetypeservice,
              private gradeservice: Gradeservice,
              private officetypeservice: Officetypeservice,
              private qualificationsservice: Qualificationsservice,
              private staffdesignationservice: Staffdesignationservice,
              private titleservice: Titleservice,
              private matDialog: MatDialog,
              private regexservice: Regexservice,
              private dp: DatePipe) {

    this.uiassist = new UiAssist(this);

    //Client search form Group
    this.csearch = this.fb.group({
      'cscallingname': new FormControl(),
      'csnic': new FormControl(),
      'csdesignation': new FormControl(),
      // 'csgender': new FormControl(),
      'csStatus': new FormControl(),
      'csgrade': new FormControl(),
    });

    //Server search form Group
    this.ssearch = this.fb.group({
      'sscallingname': new FormControl(),
      'ssnic': new FormControl(),
      'ssStaffdesignation': new FormControl(),
      'ssgender': new FormControl(),
      'ssoffice': new FormControl(),
    });
    this.minDate = new Date(1950, 0, 1); // January 1, 1950
    this.maxDate = new Date(1999, 11, 31); // December 31, 1999
    this.maxDate2 = new Date(); // December 31, 1999

    this.form= this.fb.group({
      'title': new FormControl('',[Validators.required]),
      'fullname': new FormControl('',[Validators.required]),
      'callingname': new FormControl('',[Validators.required]),
      'photo': new FormControl('',[Validators.required]),
      'dobirth': new FormControl('',[Validators.required]),
      'nic': new FormControl('',[Validators.required ]),
      'address': new FormControl('',[Validators.required ]),
      'email': new FormControl('',[Validators.required]),
      'mobile': new FormControl('',[Validators.required]),
      'land': new FormControl(''),
      'dofirstappoint': new FormControl('',[Validators.required]),
      'description': new FormControl(''),
      'gender': new FormControl('',[Validators.required]),
      'officetype': new FormControl('',[Validators.required]),
      'staffdesignation': new FormControl('',[Validators.required]),
      'empstatus': new FormControl('',[Validators.required]),
      'grade': new FormControl('',[Validators.required]),
      'gradetype': new FormControl('',[Validators.required]),
      'civilstatus': new FormControl('',[Validators.required]),
      'qualification': new FormControl('',[Validators.required]),

    });
  }

  // Table filter method according to a client search method
  filterTable(): void {

    const csearchdata = this.csearch.getRawValue();

    this.data.filterPredicate = (staff: Staff, filter: string)=>{
      return(csearchdata.cscallingname==null||staff.callingname.toLowerCase().includes(csearchdata.cscallingname))&&
        // (csearchdata.csgender==null||staff.gender.name.toLowerCase().includes(csearchdata.csgender))&&
        (csearchdata.csdesignation==null||staff.staffdesignation.name.toLowerCase().includes(csearchdata.csdesignation))&&
        (csearchdata.csnic==null||staff.nic.toLowerCase().includes(csearchdata.csnic))&&
        (csearchdata.csStatus==null||staff.empstatus.name.toLowerCase().includes(csearchdata.csStatus))&&
      (csearchdata.csgrade == null || staff.grade.name.toLowerCase().replace(/\s/g, '').includes(csearchdata.csgrade.replace(/\s/g, '')));

    }
    this.data.filter="xx";
  }


  // All the data load in initial stage
  createView() {
    this.imageurl='assets/pending.gif';
    this.loadTable("");
  }

  selectImage(e:any): void{
    if (e.target.files){
      let reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload=(event:any)=>{this.imgeStaffurl = event.target.result;
      this.form.controls['photo'].clearValidators();
      }
    }
  }

  clearImage():void{
    this.imgeStaffurl='assets/userold.png';
    this.form.controls['photo'].setErrors({'required': true});
  }


  //Validate All form field
  createForm() {

    this.form.controls['fullname'].setValidators([Validators.required, Validators.pattern(this.regexes['fullname']['regex'])]);
    this.form.controls['title'].setValidators([Validators.required]);
    this.form.controls['callingname'].setValidators([Validators.required,Validators.pattern(this.regexes['callingname']['regex'])]);
    this.form.controls['photo'].setValidators([Validators.required]);
    this.form.controls['dobirth'].setValidators([Validators.required]);
    this.form.controls['nic'].setValidators([Validators.required,Validators.pattern(this.regexes['nic']['regex'])]);
    this.form.controls['address'].setValidators([Validators.required,Validators.pattern(this.regexes['address']['regex'])]);
    this.form.controls['email'].setValidators([Validators.required,Validators.pattern(this.regexes['email']['regex'])]);
    this.form.controls['mobile'].setValidators([Validators.required,Validators.pattern(this.regexes['mobile']['regex'])]);
    this.form.controls['land'].setValidators([Validators.pattern(this.regexes['land']['regex'])]);
    this.form.controls['dofirstappoint'].setValidators([Validators.required]);
    this.form.controls['description'].setValidators([Validators.pattern(this.regexes['description']['regex'])]);
    this.form.controls['gender'].setValidators([Validators.required]);
    this.form.controls['officetype'].setValidators([Validators.required]);
    this.form.controls['staffdesignation'].setValidators([Validators.required]);
    this.form.controls['empstatus'].setValidators([Validators.required]);
    this.form.controls['grade'].setValidators([Validators.required]);
    this.form.controls['civilstatus'].setValidators([Validators.required]);
    this.form.controls['qualification'].setValidators([Validators.required]);
    this.form.controls['gradetype'].setValidators([Validators.required]);

    Object.values(this.form.controls).forEach(control=>{control.markAsTouched();});


    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];

      control.valueChanges.subscribe(value => {
        // @ts-ignore
        if(controlName=="dobirth" || controlName=="dofirstappoint")
          value = this.dp.transform(new Date(value), 'yyyy-MM-dd');


        if (this.oldstaffObj != undefined && control.valid){
          // @ts-ignore
          if (value === this.staffObj[controlName]){ control.markAsPristine(); }
          else { control.markAsDirty(); }
        }
        else{ control.markAsPristine(); }
      });
    }
    this.enaleButtons(true, false, false);

  }

  // Load the Main Table data
  loadTable(query:string){
    this.ss.getAll(query)
      .then((stfs: Staff[]) => {this.staff=stfs; this.imageurl='assets/fullfilled.png';})
      .catch((error) => {console.log(error); this.imageurl='assets/rejected.png';})
      .finally(()=> {this.data = new MatTableDataSource(this.staff); this.data.paginator=this.paginator;});

  }
  //OnInit method
  ngOnInit(){
    this.initialize();
}

  initialize() {

    this.createView();

    this.genderservice.getAllList().then((gens: Gender[]) =>{this.genders = gens;});
    this.civilstatusservice.getAllList().then((civils: Civilstatus[]) =>{this.civilstatuses = civils;});
    this.empstatusservice.getAllList().then((emps: Empstatus[]) =>{this.empstatuses = emps;});
    //this.gradeservice.getAllList().then((grades: Grade[]) =>{this.grades = grades;});
    this.gradetypeservice.getAllList().then((grdtyps: Gradetype[]) =>{this.gradetypes = grdtyps;});
    this.officetypeservice.getAllList().then((office: Officetype[]) =>{this.officetypes = office;});
    this.qualificationsservice.getAllList().then((qualfies: Qualification[]) =>{this.qualifications = qualfies;});
    this.staffdesignationservice.getAllList().then((dess: Staffdesignation[]) =>{this.staffdesignations = dess;});
    this.titleservice.getAllList().then((titls: Title[]) =>{this.titiles = titls;});
    this.regexservice.get('staff').then((regs: []) =>{
      this.regexes = regs;
      this.createForm();
    });

  }
  //Grade loads
  loadGrade(grd:Gradetype) {
    this.gradeservice.getById(grd.id).then((grades: Grade[]) =>{
      this.grades = grades;
      console.log("aaaaaa"+JSON.stringify(this.grades));
    });
  }

  //Server search form add button
  btnSearchMc() {

    const sserchdata = this.ssearch.getRawValue();

    let callingname = sserchdata.sscallingname;
    let nic = sserchdata.ssnic;
    let genderid = sserchdata.ssgender;
    let staffdesignationid = sserchdata.ssStaffdesignation;
    let officetypeid = sserchdata.ssoffice;

    let query = '';

    if (callingname != null && callingname.trim() != "") query+="&callingname="+callingname;
    if (nic != null && nic.trim() != "") query+="&nic="+nic;
    if (genderid != null) query+="&genderid="+genderid;
    // if (email != null && email.trim() != "") query+="&email="+email;
    if (staffdesignationid != null) query+="&staffdesignationid="+staffdesignationid;
    if (officetypeid != null) query+="&officetypeid="+officetypeid;

    if (query !="") query = query.replace(/^./,"?");

   // console.log(query);

    this.loadTable(query);

  }

  //Server search form clear button
  btnSearchClearMc() {
    // @ts-ignore
    const cofirm = this.matDialog.open(ConfirmComponent,{
      with: '500px',
      data: {heading: "Search Clear", message: "Are you sure to clear the Search?"}
    });

    cofirm.afterClosed().subscribe(async result => {
      if (result){
        this.ssearch.reset();
        this.loadTable("");
      }
    });
  }

  //Staff Add method
  add(){
    let errors = this.getErrors();
    if(errors!=""){
      const errmsg = this.matDialog.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Staff Add ", message: "You have following Errors <br> "+errors}
      });
      errmsg.afterClosed().subscribe(async result => { if (!result) { return; } });
    }
    else{
      this.staffObj = this.form.getRawValue();
      //console.log("Photo-Before"+this.staff.photo);
      this.staffObj.photo=btoa(this.imgeStaffurl);
      //console.log("Photo-After"+this.staff.photo);
      let staffData: string = "";
      staffData = staffData + "<br>Title is : "+ this.staffObj.title.name;
      staffData = staffData + "<br>Fullname is : "+ this.staffObj.fullname;
      staffData = staffData + "<br>Callingname is : "+ this.staffObj.callingname;
      const confirm = this.matDialog.open(ConfirmComponent, {
        width: '500px',
        data: {heading: "Confirmation - Staff Add",
          message: "Are you sure to Add the folowing Staff? <br> <br>"+ staffData}
      });
      let addstatus:boolean=false;
      let addmessage:string="Server Not Found";
      confirm.afterClosed().subscribe(async result => {
        if(result){
          // console.log("StaffService.add(emp)");
          // @ts-ignore
          this.ss.add(this.staffObj).then((responce: []|undefined) => {
            console.log("Res-"+responce);
            console.log("Un-"+responce==undefined);
            if(responce!=undefined){ // @ts-ignore
              console.log("Add-"+responce['id']+"-"+responce['url']+"-"+(responce['errors']==""));
              // @ts-ignore
              addstatus = responce['errors']=="";
              console.log("Add Sta-"+addstatus);
              if(!addstatus) { // @ts-ignore
                addmessage=responce['errors'];
              }
            }
            else{
              console.log("undefined");
              addstatus=false;
              addmessage="Content Not Found"
            }
          }).finally( () =>{
            if(addstatus) {
              addmessage = "Successfully Saved";
              this.oldstaffObj = undefined;
              this.form.reset();
              this.clearImage();
              this.loadTable("");
              Object.values(this.form.controls).forEach(control=>{control.markAsTouched();});
              this.enaleButtons(true,false,false);
            }
            const stsmsg = this.matDialog.open(MessageComponent, {
              width: '500px',
              data: {heading: "Status -Staff Add", message: addmessage}
            });
            stsmsg.afterClosed().subscribe(async result => { if (!result) { return;} }) ;} );
        }
      });
    }
  }


  //Form Errors handle
  getErrors(){
    let errors:string='';
    for (const controlName in this.form.controls){
      const control = this.form.controls[controlName];
      if (control.errors){
        if (this.regexes[controlName]!=undefined){
          errors=errors+"<br>"+ this.regexes[controlName]['message'];}
        else
        {errors =errors+"<br>Invalid "+ controlName;}
      }
    }
    return errors;
  }



  //Fill form
  fillForm(staff: Staff){

    this.enaleButtons(false,true,true);

    this.selectedRow=staff;
    this.staffObj = JSON.parse(JSON.stringify(staff));

    //console.log("bbbbbbbb---"+ JSON.stringify(staff.grade));
   // console.log("aaaaaaa---"+ JSON.stringify(this.staffObj.grade));


    // console.log(this.staffObj)
    this.oldstaffObj = JSON.parse(JSON.stringify(staff));
    // console.log(this.oldstaffObj)

    if (this.staffObj.photo != null){
      this.imgeStaffurl = atob(this.staffObj.photo);
      this.form.controls['photo'].clearValidators();
    }else {
      this.clearImage();
    }


    this.staffObj.photo = "";


    // @ts-ignore
    this.staffObj.title = this.titiles.find(title=> title.id === this.staffObj.title.id);

    // @ts-ignore
    this.staffObj.officetype = this.officetypes.find(officetype=> officetype.id === this.staffObj.officetype.id);

    // @ts-ignore
    this.staffObj.civilstatus = this.civilstatuses.find(civilstatus=> civilstatus.id === this.staffObj.civilstatus.id);

    // @ts-ignore
    this.staffObj.empstatus = this.empstatuses.find(empstatus=> empstatus.id === this.staffObj.empstatus.id);

    // @ts-ignore
    this.staffObj.qualification = this.qualifications.find(qualification=> qualification.id === this.staffObj.qualification.id);

    // @ts-ignore
    this.staffObj.gender = this.genders.find(gender=> gender.id === this.staffObj.gender.id);

    // @ts-ignore
    this.staffObj.staffdesignation = this.staffdesignations.find(staffdesignation=> staffdesignation.id  === this.staffObj.staffdesignation.id);

    //console.log("cccccc---"+ JSON.stringify(this.staffObj.grade.gradetype.id));


    // @ts-ignore
    this.staffObj.gradetype = this.gradetypes.find(gradetype=> gradetype.id === this.staffObj.grade.gradetype.id);
    //console.log("cccccc---"+ JSON.stringify(this.staffObj.grade.gradetype.id));

    // this.loadGrade(this.staffObj.grade.gradetype);

    this.gradeservice.getById(this.staffObj.grade.gradetype.id).then((grades: Grade[]) =>{
      this.grades = grades;
      // @ts-ignore
      this.staffObj.grade = this.grades.find(grade=> grade.id === this.staffObj.grade.id);
      //this.form.patchValue(this.staffObj.grade);
      this.form.patchValue(this.staffObj);
      this.form.markAsPristine();
    });


  }


//Get updates
  getUpdates(): string{
    let updates: string = "";
    for (const controlName in this.form.controls){
      const control = this.form.controls[controlName];
      if (control.dirty){
        updates = updates + "<br>" + controlName.charAt(0).toUpperCase() + controlName.slice(1)+" Changed";
      }
    }
    return updates;
  }

  enaleButtons(add:boolean, upd:boolean, del:boolean){
    this.enaadd = add;
    this.enaupd = upd;
    this.enadel = del;
  }

  // Update function
  update() {
    let errors = this.getErrors();
    if (errors != "") {
      const errmsg = this.matDialog.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Staff Update ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => { if (!result) { return; } });
    } else {
      let updates: string = this.getUpdates();
      if (updates != "") {
        let updstatus: boolean = false;
        let updmessage: string = "Server Not Found";
        const confirm = this.matDialog.open(ConfirmComponent, {
          width: '500px',
          data: {
            heading: "Confirmation - Server Update",
            message: "Are you sure to Save folowing Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {
            this.staffObj = this.form.getRawValue();
            if (this.form.controls['photo'].dirty) this.staffObj.photo = btoa(this.imgeStaffurl);
            else { // @ts-ignore
              this.staffObj.photo = this.oldstaffObj.photo;
            }

            // @ts-ignore
            this.staffObj.id = this.oldstaffObj.id;
            this.ss.update(this.staffObj).then((responce: [] | undefined) => {
              if (responce != undefined) { // @ts-ignore
                // @ts-ignore
                updstatus = responce['errors'] == "";

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
                this.oldstaffObj = undefined;
                this.form.reset();
                this.clearImage();
                this.loadTable("");
                Object.values(this.form.controls).forEach(control=>{control.markAsTouched();});
                this.enaleButtons(true,false,false);

              }
              const stsmsg = this.matDialog.open(MessageComponent, {
                width: '500px',
                data: {heading: "Status -Staff Update", message: updmessage}
              });
              stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });
            });
          }
        });
      }
      else {
        const updmsg = this.matDialog.open(MessageComponent, {
          width: '500px',
          data: {heading: "Confirmation - Employee Update", message: "Nothing Changed"}
        });
        updmsg.afterClosed().subscribe(async result => { if (!result) { return; } });
      }
    }
  }

  //Delete Method
  delete() {
    const confirm = this.matDialog.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Staff Delete",
        message: "Are you sure to Delete folowing Staff Member? <br> <br>" +
          this.staffObj.callingname
      }
    });
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";
        // @ts-ignore
        this.ss.delete(this.staffObj.id).then((responce: [] | undefined) => {
          if (responce != undefined) { // @ts-ignore
            delstatus = responce['errors'] == "";
            if (!delstatus) { // @ts-ignore
              delmessage = responce['errors'];
            }
          } else {
            delstatus = false;
            delmessage = "Content Not Found"
          }
        } ).finally(() => {
          if (delstatus) {
            delmessage = "Successfully Deleted";
            this.oldstaffObj = undefined;
            this.form.reset();
            this.clearImage();
            this.loadTable("");
            Object.values(this.form.controls).forEach(control=>{control.markAsTouched();});
            this.enaleButtons(true,false,false);

          }
          const stsmsg = this.matDialog.open(MessageComponent, {
            width: '500px',
            data: {heading: "Status - Staff Delete ", message: delmessage}
          });
          stsmsg.afterClosed().subscribe(async result => { if (!result) { return; }
          });
        });
      }
    });
  }

//Clear Form
  clearForm() {
    const confirm = this.matDialog.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Clear Form",
        message: "Are you sure to Clear folowing Data ? <br> <br>"
      }
    });
    confirm.afterClosed().subscribe(async result =>{
     if (result){
       this.oldstaffObj = undefined;
       this.form.reset();
       this.clearImage();
       this.loadTable("");
       Object.values(this.form.controls).forEach(control=>{control.markAsTouched();});
       this.enaleButtons(true,false,false);
     }
    });
  }
}
