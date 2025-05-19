import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {MatDialog} from "@angular/material/dialog";
import {DatePipe} from "@angular/common";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import {Grade} from "../../../entity/grade";
import {Gradetype} from "../../../entity/gradetype";
import {Teacher} from "../../../entity/teacher";
import {Sublevel} from "../../../entity/sublevel";
import {Staffdivision} from "../../../entity/staffdivision";
import {Subject} from "../../../entity/subject";
import {Teacherservice} from "../../../service/teacherservice";
import {Staffdivisionservice} from "../../../service/staffdivisionservice";
import {Gradetypeservice} from "../../../service/gradetypeservice";
import {Sublevelservice} from "../../../service/sublevelservice";
import {Gradeservice} from "../../../service/gradeservice";
import {Subjectservice} from "../../../service/subjectservice";
import {Regexservice} from "../../../service/regexservice";
import {UiAssist} from "../../../util/ui.assist/ui.assist";
import {Staff} from "../../../entity/staff";
import {Division} from "../../../entity/division";
import {Divisionservice} from "../../../service/divisionservice";
import {Staffservice} from "../../../service/staffservice";

@Component({
  selector: 'app-staffdivision',
  templateUrl: './staffdivision.component.html',
  styleUrls: ['./staffdivision.component.css']
})
export class StaffdivisionComponent {

  columns: string[] = ['staff','gradetype','grade','empstatus','officetype','division','doassigned', 'doresigned','docreated','domodified'];
  headers: string[] = ['Staff Member', 'Grade-Type','Grade','Staff Status','Office-Type','Division Name','Date of Assign', 'Date of Resign','Date of Created','Date of Modified'];
  binders: string[] = ['staff.fullname','staff.grade.gradetype.name', 'staff.grade.name','staff.empstatus.name','staff.officetype.name','division.name','doassigned', 'doresigned','docreated','domodified'];

  cscolumns: string[] = [ 'csstaff','csgradetype','csstatus','csdivision'];
  csprompts: string[] = ['Search by Staff member name','Search by Grade-Type', 'Search by Status','Search by Division'];

  public csearch!: FormGroup;
  public ssearch!: FormGroup;
  public form!: FormGroup;

  staffdivision!:Staffdivision;
  oldstaffdivision!:Staffdivision|undefined;

  selectedRow: any;

  grades: Array<Grade> = [];
  gradetypes: Array<Gradetype> = [];
  staffs: Array<Staff> = [];
  divisions: Array<Division> = [];

  staffdivisions: Array<Staffdivision> = [];
  data!: MatTableDataSource<Staffdivision>;
  imageurl: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  enaadd:boolean = false;
  enaupd:boolean = false;
  enadel:boolean = false;

  uiassist: UiAssist;

  constructor(
    private fb:FormBuilder,
    private staffservice:Staffservice,
    private staffdivisionservice:Staffdivisionservice,
    private gradetypeservice: Gradetypeservice,
    private gradeservice: Gradeservice,
    private divisionservice: Divisionservice,
    private dp:DatePipe,
    private dg:MatDialog,
    private regexservice:Regexservice,
    private matDialog: MatDialog,
  ) {

    this.uiassist = new UiAssist(this);
    this.staffdivisions = new Array<Staffdivision>();

    this.csearch = this.fb.group({
      "csstaff": new FormControl(),
      "csdivision": new FormControl(),
      "csstatus": new FormControl(),
      "csgradetype": new FormControl(),
    });

    const today = new Date();
    console.log( today.toISOString())
    const formattedDate = today.toISOString().split("T")[0];

    this.form = this.fb.group({
      "staff": new FormControl('',[Validators.required]),
      "doassigned": new FormControl('',[Validators.required]),
      "doresigned": new FormControl({value:'', disabled: true}),
      'grade': new FormControl('',[Validators.required]),
      'gradetype': new FormControl('',[Validators.required]),
      "division": new FormControl('',[Validators.required]),
      "docreated": new FormControl({value:formattedDate, disabled: false},[Validators.required]),
      'domodified': new FormControl({value: null, disabled: true},[Validators.required])
    });

    // this.ssearch = this.fb.group({
    //   "ssitem": new FormControl(),
    //   "sscustomer": new FormControl(),
    //   "ssinvoicestatus": new FormControl()
    // });

  }

  ngOnInit() {
    this.initialize();
  }


  initialize() {
    this.createView();

    this.gradetypeservice.getbyStaffsecgrade().then((grdtyps: Gradetype[]) =>{this.gradetypes = grdtyps;});

    this.divisionservice.getAllList().then((secs:Division[])=>{
      this.divisions = secs;
    });
    this.createForm();
  }
  //Grade loads
  loadGrade(id: number) {
    this.gradeservice.getById(id).then((grades: Grade[]) =>{this.grades = grades;});
  }
  //Teacher load
  loadStaff(id: number) {
    console.log(id);
    // @ts-ignore
    this.staffservice.getByStaffDivId(id).then((staff: Staff[]) =>{this.staffs = staff ;});

  }


  createView() {
    this.imageurl = 'assets/pending.gif';
    this.loadTable("");
  }

  loadTable(query: string) {

    this.staffdivisionservice.getAll(query)
      .then((usrs: Staffdivision[]) => {
        this.staffdivisions = usrs;
        console.log(this.staffdivisions)
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.staffdivisions);
        this.data.paginator = this.paginator;
      });
  }


  clearMainForm(){

    const today = new Date();
    console.log( today.toISOString())
    const formattedDate = today.toISOString().split("T")[0];

    this.oldstaffdivision = undefined;
    this.form.controls['staff'].reset();
    this.form.controls['doassigned'].reset();
    this.form.controls['doresigned'].reset();
    this.form.controls['grade'].reset();
    this.form.controls['gradetype'].reset();
    this.form.controls['division'].reset();
    this.form.controls['domodified'].reset();
    this.form.controls['docreated'].setValue(formattedDate);

  }


  filterTable(): void {

    const cserchdata = this.csearch.getRawValue();


    this.data.filterPredicate = (div: Staffdivision, filter: string) => {
      return (cserchdata.csstaff == null || div.staff.fullname.toLowerCase().includes(cserchdata.csstaff))&&
        (cserchdata.csgradetype == null || div.staff.grade.gradetype.name.toLowerCase().includes(cserchdata.csgradetype))&&
        (cserchdata.csdivision == null || div.division.name.toLowerCase().includes(cserchdata.csdivision))&&
        (cserchdata.csstatus == null || div.staff.empstatus.name.toLowerCase().includes(cserchdata.csstatus))

    };

    this.data.filter = 'xx';

  }


  // btnSearchMc(): void {
  //
  //   const sserchdata = this.ssearch.getRawValue();
  //
  //   let customer = sserchdata.sscustomer;
  //   let statusid = sserchdata.ssinvoicestatus;
  //
  //   let query = "";
  //
  //   if (customer != null && customer.trim() != "") query = query + "&customer=" + customer;
  //   if (statusid != null) query = query + "&statusid=" + statusid;
  //
  //   if (query != "") query = query.replace(/^./, "?")
  //
  //   this.loadTable(query);
  //
  // }
  //
  // btnSearchClearMc(): void {
  //
  //   const confirm = this.dg.open(ConfirmComponent, {
  //     width: '500px',
  //     data: {heading: "Search Clear", message: "Are you sure to Clear the Search?"}
  //   });
  //
  //   confirm.afterClosed().subscribe(async result => {
  //     if (result) {
  //       this.ssearch.reset();
  //       this.loadTable("");
  //     }
  //   });
  //
  // }
  //

  createForm() {
    this.form.controls['staff'].setValidators([Validators.required]);
    this.form.controls['gradetype']?.setValidators([Validators.required]);
    this.form.controls['grade']?.setValidators([Validators.required]);
    this.form.controls['doassigned'].setValidators([Validators.required]);
    this.form.controls['doresigned'].setValidators([]);
    this.form.controls['division'].setValidators([Validators.required]);
    this.form.controls['docreated'].setValidators([Validators.required]);
    this.form.controls['domodified'].setValidators([Validators.required]);

    Object.values(this.form.controls).forEach( control => { control.markAsTouched(); } );

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {
          // @ts-ignore
          if (controlName == "doassign" || controlName == "doresign" || controlName == "docreated")
            value = this.dp.transform(new Date(value), 'yyyy-MM-dd');

          if (this.oldstaffdivision != undefined && control.valid) {
            // @ts-ignore
            if (value === this.staffdivision[controlName]) {
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

  add(){
    let errors = this.getErrors();
    if(errors!=""){
      const errmsg = this.matDialog.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Staffdivision Add ", message: "You have following Errors <br> "+errors}
      });
      errmsg.afterClosed().subscribe(async result => { if (!result) { return; } });
    }
    else{
      this.staffdivision = this.form.getRawValue();
      console.log(this.staffdivision)
      let staffdivisionData: string = "";
      staffdivisionData = staffdivisionData + "<br>Title is : "+ this.staffdivision.staff.fullname;
      staffdivisionData = staffdivisionData + "<br>Fullname is : "+ this.staffdivision.division.name;
      const confirm = this.matDialog.open(ConfirmComponent, {
        width: '500px',
        data: {heading: "Confirmation - Staffdivision Add",
          message: "Are you sure to Add the folowing Staff? <br> <br>"+ staffdivisionData}
      });
      let addstatus:boolean=false;
      let addmessage:string="Server Not Found";
      confirm.afterClosed().subscribe(async result => {
        if(result){
          // console.log("StaffService.add(emp)");
          // @ts-ignore
          this.staffdivisionservice.add(this.staffdivision).then((responce: []|undefined) => {
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
              this.clearMainForm();
              Object.values(this.form.controls).forEach(control=>{control.markAsTouched();});
              this.enableButtons(true,false,false);
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

  enableButtons(add:boolean, upd:boolean, del:boolean){
    this.enaadd=add;
    this.enaupd=upd;
    this.enadel=del;
  }

  getErrors(): string {

    let errors: string = "";

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      if (control.errors) errors = errors + "<br>Invalid " + controlName;
    }

    return errors;
  }

  //Fill form
  fillForm(staffdivision: Staffdivision){

    this.form.controls['domodified'].enable();
    this.form.controls['doresigned'].enable();
    this.form.controls['docreated'].disable();

    this.enableButtons(false,true,true);

    this.selectedRow=staffdivision;
    this.staffdivision = JSON.parse(JSON.stringify(staffdivision));
    // console.log(this.staffObj)
    this.oldstaffdivision = JSON.parse(JSON.stringify(staffdivision));


    // @ts-ignore
    this.staffdivision.gradetype = this.gradetypes.find(gradetype=> gradetype.id === this.staffdivision.staff.grade.gradetype.id);
    // console.log("cccccc---"+ JSON.stringify(this.staffdivisionObj.staffCreator.grade.gradetype.id));

    this.gradeservice.getById(this.staffdivision.staff.grade.gradetype.id).then((grades: Grade[]) =>{
      this.grades = grades;
      // @ts-ignore
      this.staffdivision.grade = this.grades.find(grade=> grade.id === this.staffdivision.staff.grade.id);
      // @ts-ignore
      this.staffservice.getByStaffId(this.staffdivision.grade.id).then((tech: Staff[]) =>{
        this.staffs = tech;
        // @ts-ignore
        this.staffdivision.staff = this.staffs.find(ss=>ss.id === this.staffdivision.staff.id)
        console.log(this.staffdivision.staff.id);

        // @ts-ignore
        this.staffdivision.division = this.divisions.find(secs=> secs.id === this.staffdivision.division.id);

        if (this.staffdivision.domodified != null){
          // @ts-ignore
          this.staffdivision.domodified = null;
          this.form.patchValue(this.staffdivision);
          this.form.markAsPristine();
        }else {
          this.form.patchValue(this.staffdivision);
          this.form.markAsPristine();
        }
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

  //Update Staffdivision
  update() {
    let errors = this.getErrors();
    if (errors != "") {
      const errmsg = this.matDialog.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Staffdivision Update ", message: "You have following Errors <br> " + errors}
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
            this.staffdivision = this.form.getRawValue();

            // @ts-ignore
            this.staffdivision.id = this.oldstaffdivision.id;
            this.staffdivisionservice.update(this.staffdivision).then((responce: [] | undefined) => {
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
                this.form.controls['domodified'].disable();
                this.form.controls['doresigned'].disable();
                this.form.controls['docreated'].enable();
                this.clearMainForm();
                Object.values(this.form.controls).forEach(control=>{control.markAsTouched();});
                this.enableButtons(true,false,false);
                this.loadTable("");
              }
              const stsmsg = this.matDialog.open(MessageComponent, {
                width: '500px',
                data: {heading: "Status -Staffdivision Update", message: updmessage}
              });
              stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });
            });
          }
        });
      }
      else {
        const updmsg = this.matDialog.open(MessageComponent, {
          width: '500px',
          data: {heading: "Confirmation - Staffdivision Update", message: "Nothing Changed"}
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
        this.form.controls['domodified'].disable();
        this.form.controls['doresigned'].disable();
        this.form.controls['docreated'].enable();
        this.clearMainForm();
        Object.values(this.form.controls).forEach(control=>{control.markAsTouched();});
        this.enableButtons(true,false,false);
        this.loadTable("");
      }
    });
  }

//Delete Staffdivision

  delete() {
    const confirm = this.matDialog.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Staffdivision Delete",
        message: "Are you sure to Delete folowing Member? <br> <br>" +
          this.staffdivision.staff.fullname
      }
    });
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";
        // @ts-ignore
        this.staffdivisionservice.delete(this.staffdivision.id).then((responce: [] | undefined) => {
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
            this.form.controls['domodified'].disable();
            this.form.controls['doresigned'].disable();
            this.form.controls['docreated'].enable();
            this.clearMainForm();
            Object.values(this.form.controls).forEach(control=>{control.markAsTouched();});
            this.enableButtons(true,false,false);
            this.loadTable("");

          }
          const stsmsg = this.matDialog.open(MessageComponent, {
            width: '500px',
            data: {heading: "Status - Staffdivision Delete ", message: delmessage}
          });
          stsmsg.afterClosed().subscribe(async result => { if (!result) { return; }
          });
        });
      }
    });
  }

}

