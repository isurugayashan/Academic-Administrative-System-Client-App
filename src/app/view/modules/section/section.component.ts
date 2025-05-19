import {Component, ViewChild} from '@angular/core';
import {Section} from "../../../entity/section";
import {Sectionservice} from "../../../service/sectionservice";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {UiAssist} from "../../../util/ui.assist/ui.assist";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {Regexservice} from "../../../service/regexservice";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import {DatePipe} from "@angular/common";
import {Secstatus} from "../../../entity/secstatus";
import {Secstatusservice} from "../../../service/secstatusservice";
import {Division} from "../../../entity/division";


@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.css'],
})
export class SectionComponent {
  cols = "12";

  //Table columns
  columns: string[] = ['name','staffcount', 'mobile','docreated','doresign','status', 'description'];
  headers: string[] = ['Section Name','Section Staff', 'Mobile','Create Date','Resign Date','Section Status','Description'];
  binders: string[] = ['name','staffcount','mobile','docreated', 'doresign','secstatus.name','description'];

  //Client Search columns
  // cscolumns: string[] = ['csname','cstatus'];
  // csprompts: string[] = ['Search by Section-Name', 'Search by Status'];

  public csearch!: FormGroup;
  public ssearch!: FormGroup;
  public form!: FormGroup;

  sectionObj!: Section;
  oldsectionObj!: Section| undefined;

  selectedRow: any;

  enaadd:boolean =false;
  enaupd:boolean =false;
  enadel:boolean =false;

  section: Array<Section> = [];
  data!: MatTableDataSource<Section>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  imageurl : string = '';

  //Supportive Arrays
  secstatus: Array<Secstatus> = [];

  regexes: any;

  uiassist: UiAssist;


  constructor(private sectionservice: Sectionservice,
              private fb: FormBuilder,
              private secstatusservice: Secstatusservice,
              private matDialog: MatDialog,
              private regexservice: Regexservice,
              private dp: DatePipe) {

    this.uiassist = new UiAssist(this);


    //Server search form Group
    this.ssearch = this.fb.group({
      'ssname': new FormControl(),
      'ssmobile': new FormControl(),
      'ssStatus': new FormControl(),
    });

    //Client search form Group
    // this.csearch = this.fb.group({
    //   'csname': new FormControl(),
    //   'cstatus': new FormControl(),
    // });
    const today = new Date();
    console.log( today.toISOString())
    const formattedDate = today.toISOString().split("T")[0];


    this.form= this.fb.group({
      'name': new FormControl('',[Validators.required]),
      'staffcount': new FormControl('',[Validators.required]),
      'docreated': new FormControl({value:formattedDate, disabled: false},[Validators.required]),
      'doresign': new FormControl({value:"", disabled: true}),
      'mobile': new FormControl('',[Validators.required]),
      'description': new FormControl(''),
      'secstatus': new FormControl('',[Validators.required]),
    });
  }

  //Validate All form field
  createForm() {
    this.form.controls['name']?.setValidators([Validators.required, Validators.pattern(this.regexes['name']['regex'])]);
    this.form.controls['docreated']?.setValidators([Validators.required]);
    this.form.controls['mobile']?.setValidators([Validators.required,Validators.pattern(this.regexes['mobile']['regex'])]);
    this.form.controls['staffcount']?.setValidators([Validators.required,Validators.pattern(this.regexes['staffcount']['regex'])]);
    this.form.controls['description']?.setValidators([Validators.pattern(this.regexes['description']['regex'])]);
    this.form.controls['secstatus']?.setValidators([Validators.required]);

    Object.values(this.form.controls).forEach(control=>{control.markAsTouched();});

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];

      control.valueChanges.subscribe(value => {
        // @ts-ignore
        if(controlName=="docreated" || controlName=="doresign")
          value = this.dp.transform(new Date(value), 'yyyy-MM-dd');


        if (this.oldsectionObj != undefined && control.valid){
          // @ts-ignore
          if (value === this.sectionObj[controlName]){ control.markAsPristine(); }
          else { control.markAsDirty(); }
        }
        else{ control.markAsPristine(); }
      });
    }
    this.enaleButtons(true, false, false);

  }
  createView() {
    this.imageurl = 'assets/pending.gif';
    this.loadTable("");
  }


  clearMainForm(){

    const today = new Date();
    console.log( today.toISOString())
    const formattedDate = today.toISOString().split("T")[0];

    this.oldsectionObj = undefined;
    this.form.controls['name'].reset();
    this.form.controls['staffcount'].reset();
    this.form.controls['doresign'].reset();
    this.form.controls['mobile'].reset();
    this.form.controls['description'].reset();
    this.form.controls['secstatus'].reset();

    this.form.controls['docreated'].setValue(formattedDate);
  }
  // loadForm(){
  //
  //
  //   this.selectedRow = null;
  //
  // }
  //filter table
  // filterTable(): void {
  //
  //   const csearchdata = this.csearch.getRawValue();
  //
  //   // @ts-ignore
  //   this.data.filterPredicate = (div: Section, filter: string)=>{
  //     return(csearchdata.csname==null||div.name.toLowerCase().includes(csearchdata.csname))&&
  //       (csearchdata.cstatus==null||div.secstatus.name.toLowerCase().includes(csearchdata.cstatus))
  //   }
  //   this.data.filter="xx";
  // }

  // Load the Main Table data
  loadTable(query:string){
    this.sectionservice.getAll(query)
      .then((secs: Section[]) => {this.section=secs; this.imageurl='assets/fullfilled.png';})
      .catch((error) => {console.log(error); this.imageurl='assets/rejected.png';})
      .finally(()=> {this.data = new MatTableDataSource(this.section); this.data.paginator=this.paginator;});

  }

  ngOnInit(){
    this.initialize();
  }

  initialize() {
    this.createView()

    this.secstatusservice.getAllList().then((status: Secstatus[]) =>{this.secstatus = status;});
    this.regexservice.get('section').then((regs: []) =>{
      this.regexes = regs;
      // console.log("R" + this.regexes['email']['regex']);
      this.createForm();
    });
  }


  //Server search form add button
  btnSearchMc() {

    const sserchdata = this.ssearch.getRawValue();

    let name = sserchdata.ssname;
    let director = sserchdata.ssDirector;
    let statusid = sserchdata.ssStatus;

    let query = '';

    if (name != null && name.trim() != "") query+="&name="+name;
    if (director != null && director.trim() != "") query+="&director="+director;
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

  //Section Add method
  add(){
    let errors = this.getErrors();
    if(errors!=""){
      const errmsg = this.matDialog.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Section Add ", message: "You have following Errors <br> "+errors}
      });
      errmsg.afterClosed().subscribe(async result => { if (!result) { return; } });
    }
    else{
      this.sectionObj = this.form.getRawValue();
      //console.log("Photo-Before"+this.section.photo);
      //console.log("Photo-After"+this.section.photo);
      let sectionData: string = "";
      // sectionData = sectionData + "<br>Title is : "+ this.sectionObj.title.name;
      // sectionData = sectionData + "<br>Fullname is : "+ this.sectionObj.fullname;
      // sectionData = sectionData + "<br>Callingname is : "+ this.sectionObj.callingname;
      const confirm = this.matDialog.open(ConfirmComponent, {
        width: '500px',
        data: {heading: "Confirmation - Section Add",
          message: "Are you sure to Add the folowing Section? <br> <br>"+ sectionData}
      });
      let addstatus:boolean=false;
      let addmessage:string="Server Not Found";
      confirm.afterClosed().subscribe(async result => {
        if(result){
          // console.log("SectionService.add(emp)");
          // @ts-ignore
          this.sectionservice.add(this.sectionObj).then((responce: []|undefined) => {
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
              this.loadTable("");
              Object.values(this.form.controls).forEach(control=>{control.markAsTouched();});
              this.enaleButtons(true,false,false);
            }
            const stsmsg = this.matDialog.open(MessageComponent, {
              width: '500px',
              data: {heading: "Status -Section Add", message: addmessage}
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
  fillForm(section: Section){

    this.form.controls['docreated'].disable();
    this.form.controls['doresign'].enable();

    this.enaleButtons(false,true,true);

    this.selectedRow=section;

    this.sectionObj = JSON.parse(JSON.stringify(section));
    // console.log(this.sectionObj)
    this.oldsectionObj = JSON.parse(JSON.stringify(section));


    // @ts-ignore
    this.sectionObj.secstatus = this.secstatus.find(secstatus=> secstatus.id === this.sectionObj.secstatus.id);

    this.form.patchValue(this.sectionObj);
    this.form.markAsPristine();
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
        data: {heading: "Errors - Section Update ", message: "You have following Errors <br> " + errors}
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
            this.sectionObj = this.form.getRawValue();

            // @ts-ignore
            this.sectionObj.id = this.oldsectionObj.id;
            this.sectionservice.update(this.sectionObj).then((responce: [] | undefined) => {
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
                this.clearMainForm();
                this.form.controls['docreated'].enable();
                this.form.controls['doresign'].disable();
                this.loadTable("");
                Object.values(this.form.controls).forEach(control=>{control.markAsTouched();});
                this.enaleButtons(true,false,false);
              }
              const stsmsg = this.matDialog.open(MessageComponent, {
                width: '500px',
                data: {heading: "Status -Section Update", message: updmessage}
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
        heading: "Confirmation - Section Delete",
        message: "Are you sure to Delete folowing Section Member? <br> <br>" +
          this.sectionObj.name
      }
    });
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";
        // @ts-ignore
        this.sectionservice.delete(this.sectionObj.id).then((responce: [] | undefined) => {
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
            this.form.controls['docreated'].enable();
            this.form.controls['doresign'].disable();
            this.clearMainForm();
            this.loadTable("");
            Object.values(this.form.controls).forEach(control=>{control.markAsTouched();});
            this.enaleButtons(true,false,false);
          }
          const stsmsg = this.matDialog.open(MessageComponent, {
            width: '500px',
            data: {heading: "Status - Section Delete ", message: delmessage}
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
        this.clearMainForm();
        this.form.controls['docreated'].enable();
        this.form.controls['doresign'].disable();
        this.loadTable("");
        Object.values(this.form.controls).forEach(control=>{control.markAsTouched();});
        this.enaleButtons(true,false,false);
      }
    });
  }
}
