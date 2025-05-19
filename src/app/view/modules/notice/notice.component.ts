import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Staff} from "../../../entity/staff";

import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {Gender} from "../../../entity/gender";
import {Civilstatus} from "../../../entity/civilstatus";
import {Empstatus} from "../../../entity/empstatus";
import {Grade} from "../../../entity/grade";
import {Gradetype} from "../../../entity/gradetype";
import {Officetype} from "../../../entity/officetype";
import {Qualification} from "../../../entity/qualifications";
import {Staffdesignation} from "../../../entity/staffdesignation";
import {Title} from "../../../entity/title";
import {UiAssist} from "../../../util/ui.assist/ui.assist";
import {Staffservice} from "../../../service/staffservice";
import {Genderservice} from "../../../service/genderservice";
import {Civilstatusservice} from "../../../service/civilstatusservice";
import {Empstatusservice} from "../../../service/empstatusservice";
import {Gradetypeservice} from "../../../service/gradetypeservice";
import {Gradeservice} from "../../../service/gradeservice";
import {Officetypeservice} from "../../../service/officetypeservice";
import {Qualificationsservice} from "../../../service/qualificationservice";
import {Staffdesignationservice} from "../../../service/staffdesignationservice";
import {Titleservice} from "../../../service/titileservice";
import {MatDialog} from "@angular/material/dialog";
import {Regexservice} from "../../../service/regexservice";
import {DatePipe} from "@angular/common";

import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {Notice} from "../../../entity/notice";
import {Noticeservice} from "../../../service/noticeservice";
import {Noticecategoryservice} from "../../../service/noticecategoryservice";
import {Noticepriorityservice} from "../../../service/noticepriorityservice";
import {Noticestatusservice} from "../../../service/noticestatusservice";
import {Noticecategory} from "../../../entity/noticecategory";
import {Noticestatus} from "../../../entity/noticestatus";
import {Noticepriority} from "../../../entity/noticepriority";


@Component({
  selector: 'app-notice',
  templateUrl: './notice.component.html',
  styleUrls: ['./notice.component.css']
})
export class NoticeComponent {

  columns: string[] = ['title','text','dopublished','doexpired','domodified','noticecategory','noticepriority','noticestatus','staffCreator'];
  headers: string[] = ['Title','Content','Publish-Date','Expire-Date','Modified-Date', 'Category','Priority','Status','Creator-Name'];
  binders: string[] = ['title','text','dopublished', 'doexpired','domodified','noticecategory.name','noticepriority.name','noticestatus.name','staffCreator.callingname'];

  cscolumns: string[] = ['cspriority','csstatus','cscategory'];
  csprompts: string[] = ['Search by Priority','Search by Status', 'Search by Category'];

  public csearch!: FormGroup;
  public ssearch!: FormGroup;
  public form!: FormGroup;

  selectedFileName!: string;
  noticeObj!: Notice;
  noticeOldObj!: Notice| undefined;

  selectedRow: any;


  enaadd:boolean =false;
  enaupd:boolean =false;
  enadel:boolean =false;
  enprint: boolean = false;

  notices: Array<Notice> = [];
  imageurl : string = '';
  data!: MatTableDataSource<Notice>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  imgeTeachurl: string = 'assets/userold.png';

  //Supportive Arrays

  grades: Array<Grade> = [];
  gradetypes: Array<Gradetype> = [];
  staffCreators: Array<Staff> = [];
  noticecatgories: Array<Noticecategory> = [];
  noticestatuses: Array<Noticestatus> = [];
  noticepriorities: Array<Noticepriority> = [];

  regexes: any;

  uiassist: UiAssist;

  constructor(private noticeservice: Noticeservice,
              private fb: FormBuilder,
              private noticecategoryservice: Noticecategoryservice,
              private noticepriorityservice: Noticepriorityservice,
              private noticestatusservice: Noticestatusservice,
              private gradetypeservice: Gradetypeservice,
              private gradeservice: Gradeservice,
              private matDialog: MatDialog,
              private regexservice: Regexservice,
              private staffservice: Staffservice,
              private dp: DatePipe,
              ) {

    this.uiassist = new UiAssist(this);

    //Client search form Group
    this.csearch = this.fb.group({
      'cspriority': new FormControl(),
      'csstatus': new FormControl(),
      'cscategory': new FormControl(),
    });

    const today = new Date();
    console.log(today)
    const formattedDate = today.toISOString().split("T")[0];
    this.form= this.fb.group({
      'title': new FormControl('',[Validators.required]),
      'grade': new FormControl('',[Validators.required]),
      'gradetype': new FormControl('',[Validators.required]),
      'text': new FormControl(),
      'dopublished': new FormControl({value:formattedDate, disabled: false},[Validators.required]),
      'file': new FormControl(),
      'doexpired': new FormControl('',[Validators.required]),
      'domodified': new FormControl({value: null, disabled: true},[Validators.required]),
      'noticecategory': new FormControl('',[Validators.required ]),
      'noticepriority': new FormControl('',[Validators.required ]),
      'noticestatus': new FormControl('',[Validators.required]),
      'staffCreator': new FormControl('',[Validators.required]),


    });
  }
  //Table filter method according to a client search method
  filterTable(): void {

    const csearchdata = this.csearch.getRawValue();

    // @ts-ignore
    this.data.filterPredicate = (notice: Notice, filter: string)=>{
      return(csearchdata.cspriority==null||notice.noticepriority.name.toLowerCase().includes(csearchdata.cspriority))&&
         (csearchdata.csstatus==null||notice.noticestatus.name.toLowerCase().includes(csearchdata.csstatus))&&
        (csearchdata.cscategory==null||notice.noticecategory.name.toLowerCase().includes(csearchdata.cscategory));

    }
    this.data.filter="xx";
  }


  // All the data load in initial stage
  createView() {
    this.imageurl='assets/pending.gif';
    this.loadTable("");
  }

  selectImage(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      const file: File = event.target.files[0];
      const reader = new FileReader();

      reader.onload = (event: any) => {
        this.imgeTeachurl = event.target.result;
        this.form.controls['file'].clearValidators();
        this.form.controls['file'].updateValueAndValidity();
        this.selectedFileName = file.name; // Add this line to set the selected file name
      };

      reader.readAsDataURL(file);
    }
  }

  clearImage():void{
    this.imgeTeachurl='assets/userold.png';
   // this.form.controls['file'].setErrors({'required': true});
    this.selectedFileName = '';
  }


  // Load the Main Table data
  loadTable(query:string){
    this.noticeservice.getAll(query)
      .then((teach: Notice[]) => {this.notices=teach; this.imageurl='assets/fullfilled.png';})
      .catch((error) => {console.log(error); this.imageurl='assets/rejected.png';})
      .finally(()=> {this.data = new MatTableDataSource(this.notices); this.data.paginator=this.paginator;});

  }

  ngOnInit(){
    this.initialize();
  }


  initialize() {
    this.createView();

    this.gradetypeservice.getbyNoticegrade().then((grdtyps: Gradetype[]) =>{this.gradetypes = grdtyps;});
    this.noticecategoryservice.getAllList().then((nc: Noticecategory[]) =>{this.noticecatgories = nc;});
    this.noticepriorityservice.getAllList().then((np: Noticepriority[]) =>{this.noticepriorities = np;});
    // @ts-ignore
    this.noticestatusservice.getAllList().then((ns: Noticestatus[]) =>{this.noticestatuses = ns;});
    this.regexservice.get('notice').then((regs: []) =>{
      this.regexes = regs;
      this.createForm();
    });
  }


  //Validate All form field
  createForm() {

    this.form.controls['title']?.setValidators([Validators.required, Validators.pattern(this.regexes['title']['regex'])]);
    this.form.controls['gradetype']?.setValidators([Validators.required]);
    this.form.controls['grade']?.setValidators([Validators.required]);
    this.form.controls['text']?.setValidators([Validators.pattern(this.regexes['text']['regex'])]);
    this.form.controls['file']?.setValidators([]);
    this.form.controls['dopublished']?.setValidators([Validators.required]);
    this.form.controls['doexpired']?.setValidators([Validators.required]);
    this.form.controls['domodified']?.setValidators([Validators.required]);
    this.form.controls['noticecategory']?.setValidators([Validators.required]);
    this.form.controls['noticepriority']?.setValidators([Validators.required]);
    this.form.controls['noticestatus']?.setValidators([Validators.required]);
    this.form.controls['staffCreator']?.setValidators([Validators.required]);


     Object.values(this.form.controls).forEach(control=>{control.markAsTouched();});


    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];

      control.valueChanges.subscribe(value => {
        // @ts-ignore
        if(controlName=="dopublished" || controlName=="doexpired")
          value = this.dp.transform(new Date(value), 'yyyy-MM-dd');


        if (this.noticeOldObj != undefined && control.valid){
          // @ts-ignore
          if (value === this.noticeObj[controlName]){ control.markAsPristine(); }
          else { control.markAsDirty(); }
        }
        else{ control.markAsPristine(); }
      });
    }
     this.enaleButtons(true, false, false,false);

  }

  //Server search form add button
  btnSearchMc() {

    const sserchdata = this.ssearch.getRawValue();

    let callingname = sserchdata.sscallingname;
    let nic = sserchdata.ssnic;
    let genderid = sserchdata.ssgender;
    let statusid = sserchdata.ssStatus;

    let query = '';

    if (callingname != null && callingname.trim() != "") query+="&callingname="+callingname;
    if (nic != null && nic.trim() != "") query+="&nic="+nic;
    if (genderid != null) query+="&genderid="+genderid;
    // if (email != null && email.trim() != "") query+="&email="+email;
    if (statusid != null) query+="&statusid="+statusid;

    if (query !="") query = query.replace(/^./,"?");

    console.log(query);

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

  clearMainForm(){

    const today = new Date();
    console.log( today.toISOString())
    const formattedDate = today.toISOString().split("T")[0];

    this.form.controls['title'].reset();
    this.form.controls['gradetype'].reset();
    this.form.controls['grade'].reset();
    this.form.controls['text'].reset();
    this.form.controls['file'].reset();
    this.form.controls['doexpired'].reset()
    this.form.controls['noticecategory'].reset();
    this.form.controls['noticepriority'].reset();
    this.form.controls['noticestatus'].reset();
    this.form.controls['staffCreator'].reset();
    this.form.controls['domodified'].reset();

    this.form.controls['dopublished'].setValue(formattedDate);

  }

  //Notice Add method
  add(){
    let errors = this.getErrors();
    if(errors!=""){
      const errmsg = this.matDialog.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Notice Add ", message: "You have following Errors <br> "+errors}
      });
      errmsg.afterClosed().subscribe(async result => { if (!result) { return; } });
    }
    else{
      this.noticeObj = this.form.getRawValue();
      //console.log("File-Before"+this.staff.file);
      this.noticeObj.file=btoa(this.imgeTeachurl);
      //console.log("File-After"+this.staff.file);
      let noticeData: string = "";
      noticeData = noticeData + "<br>Title is : "+ this.noticeObj.title;
      noticeData = noticeData + "<br>Fullname is : "+ this.noticeObj.staffCreator.fullname;
      const confirm = this.matDialog.open(ConfirmComponent, {
        width: '500px',
        data: {heading: "Confirmation - Notice Add",
          message: "Are you sure to Add the folowing Staff? <br> <br>"+ noticeData}
      });
      let addstatus:boolean=false;
      let addmessage:string="Server Not Found";
      confirm.afterClosed().subscribe(async result => {
        if(result){
          // console.log("StaffService.add(emp)");
          // @ts-ignore
          this.noticeservice.add(this.noticeObj).then((responce: []|undefined) => {
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
              this.noticeOldObj = undefined;
              this.form.controls['domodified'].disable();
              this.clearMainForm()
              this.clearImage();
              Object.values(this.form.controls).forEach(control=>{control.markAsTouched();});
              this.enaleButtons(true,false,false,false,);
              this.loadTable("");
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

  enaleButtons(add:boolean, upd:boolean, del:boolean,pri:boolean){
    this.enaadd = add;
    this.enaupd = upd;
    this.enadel = del;
    this.enprint = pri;
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

  //Grade loads
  loadGrade(id: number) {
    this.gradeservice.getById(id).then((grades: Grade[]) =>{this.grades = grades;});
  }
  //Staff load
  loadStaff(id: number) {
    console.log(id);
    // @ts-ignore
    this.staffservice.getByStaffId(id).then((staff: Staff[]) =>{this.staffCreators = staff ;});


  }
  //Fill form
  fillForm(notice: Notice){

    this.form.controls['domodified'].enable();
    this.form.controls['dopublished'].disable();

    this.enaleButtons(false,true,true,true);

    this.selectedRow=notice;

    this.noticeObj = JSON.parse(JSON.stringify(notice));
    // console.log(this.staffObj)
    this.noticeOldObj = JSON.parse(JSON.stringify(notice));


    if (this.noticeObj.file != null){
      this.imgeTeachurl = atob(this.noticeObj.file);
      this.form.controls['file'].clearValidators();
    }else {
      this.clearImage();
    }

    this.noticeObj.file = "";

    // @ts-ignore
    this.noticeObj.noticepriority = this.noticepriorities.find(np=> np.id === this.noticeObj.noticepriority.id);

    // @ts-ignore
    this.noticeObj.noticestatus = this.noticestatuses.find(ns=> ns.id === this.noticeObj.noticestatus.id);
    // @ts-ignore
    this.noticeObj.noticecategory = this.noticecatgories.find(nc=> nc.id === this.noticeObj.noticecategory.id);

    // @ts-ignore
    this.noticeObj.gradetype = this.gradetypes.find(gradetype=> gradetype.id === this.noticeObj.staffCreator.grade.gradetype.id);
   // console.log("cccccc---"+ JSON.stringify(this.noticeObj.staffCreator.grade.gradetype.id));

    this.gradeservice.getById(this.noticeObj.staffCreator.grade.gradetype.id).then((grades: Grade[]) =>{
      this.grades = grades;
      // @ts-ignore
      this.noticeObj.grade = this.grades.find(grade=> grade.id === this.noticeObj.staffCreator.grade.id);
      // @ts-ignore
      this.staffservice.getByStaffId(this.noticeObj.grade.id).then((staff: Staff[]) =>{
        this.staffCreators = staff;
        // @ts-ignore
        this.noticeObj.staffCreator = this.staffCreators.find(sc=>sc.id === this.noticeObj.staffCreator.id)
        console.log(this.noticeObj)
        this.form.patchValue(this.noticeObj);
        this.form.markAsPristine();
      });
    });

  }

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

  //Update Notice
  update() {
    let errors = this.getErrors();
    if (errors != "") {
      const errmsg = this.matDialog.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Notice Update ", message: "You have following Errors <br> " + errors}
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
            this.noticeObj = this.form.getRawValue();
            if (this.form.controls['file'].dirty) this.noticeObj.file = btoa(this.imgeTeachurl);
            else { // @ts-ignore
              this.noticeObj.file = this.noticeOldObj.file;
            }

            // @ts-ignore
            this.noticeObj.id = this.noticeOldObj.id;
            this.noticeservice.update(this.noticeObj).then((responce: [] | undefined) => {
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
                this.noticeOldObj = undefined;
                this.form.controls['domodified'].disable();
                this.form.controls['dopublished'].enable();
                this.clearMainForm()
                this.clearImage();
                Object.values(this.form.controls).forEach(control=>{control.markAsTouched();});
                this.enaleButtons(true,false,false,false);
                this.loadTable("");
              }
              const stsmsg = this.matDialog.open(MessageComponent, {
                width: '500px',
                data: {heading: "Status -Notice Update", message: updmessage}
              });
              stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });
            });
          }
        });
      }
      else {
        const updmsg = this.matDialog.open(MessageComponent, {
          width: '500px',
          data: {heading: "Confirmation - Notice Update", message: "Nothing Changed"}
        });
        updmsg.afterClosed().subscribe(async result => { if (!result) { return; } });
      }
    }
  }


  //Clear Button
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
        this.noticeOldObj = undefined;
        this.form.controls['domodified'].disable();
        this.form.controls['dopublished'].enable();
        this.clearMainForm();
        this.clearImage();
        Object.values(this.form.controls).forEach(control=>{control.markAsTouched();});
        this.enaleButtons(true,false,false,false);
        this.loadTable("");
      }
    });
  }

//Delete Notice

  delete() {
    const confirm = this.matDialog.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Notice Delete",
        message: "Are you sure to Delete folowing Member? <br> <br>" +
          this.noticeObj.title
      }
    });
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";
        // @ts-ignore
        this.noticeservice.delete(this.noticeObj.id).then((responce: [] | undefined) => {
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
            this.noticeOldObj = undefined;
            this.form.controls['domodified'].disable();
            this.form.controls['dopublished'].enable();
            this.clearMainForm()
            this.clearImage();
            Object.values(this.form.controls).forEach(control=>{control.markAsTouched();});
            this.enaleButtons(true,false,false,false);
            this.loadTable("");

          }
          const stsmsg = this.matDialog.open(MessageComponent, {
            width: '500px',
            data: {heading: "Status - Notice Delete ", message: delmessage}
          });
          stsmsg.afterClosed().subscribe(async result => { if (!result) { return; }
          });
        });
      }
    });
  }


  print() {
    // @ts-ignore
    const imageDataUrl = atob(this.noticeOldObj?.file);
    const printWindow = window.open('', '_blank');

    // @ts-ignore
    printWindow.document.open();
    // @ts-ignore
    printWindow.document.write(`
    <html>
            <h1 style="text-align: center; font-size: 50px">Zonal Office Akuressa </h1>
      <body>
        <img src="${imageDataUrl}" style="height: 500px; width: 500px; margin-top: 100px; text-align: center"/>
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 1000); // Delay of 1 second (adjust as needed)
          };
        </script>
      </body>
    </html>
  `);
    // @ts-ignore
    printWindow.document.close();
  }

  }
