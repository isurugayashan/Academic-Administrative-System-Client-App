import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {UiAssist} from "../../../util/ui.assist/ui.assist";
import {MatDialog} from "@angular/material/dialog";
import {Regexservice} from "../../../service/regexservice";
import {DatePipe} from "@angular/common";

import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {Review} from "../../../entity/review";
import {Reviewstatus} from "../../../entity/reviewstatus";
import {Reviewtype} from "../../../entity/reviewtype";
import {Reviewrating} from "../../../entity/reviewrating";
import {Noticepriority} from "../../../entity/noticepriority";
import {Reviewservice} from "../../../service/reviewservice";
import {Reviewstatuservice} from "../../../service/reviewstatusservice";
import {Reviewratingservice} from "../../../service/reviewratingservice";
import {Reviewtypeservice} from "../../../service/reviewtypeservice";
import {Noticepriorityservice} from "../../../service/noticepriorityservice";
import {User} from "../../../entity/user";
import {Isreview} from "../../../entity/isreview";
import {Isreviewservice} from "../../../service/isreview";



@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent {

  columns: string[] = ['topic','toreview','message','doreview','domodified','isreview','reviewtype','reviewrating','reviewstatus','reviewpriority'];
  headers: string[] = ['Topic','Create-Time','Content','Create-Date','Modified-Date', 'Req/Feed','Type','Rating','Status','Priority'];
  binders: string[] = ['topic','toreview','message', 'doreview','domodified','isreview.name','reviewtype.name','reviewrating.name','reviewstatus.name','reviewpriority.name'];

  cscolumns: string[] = ['cstopic','csisreview','csrating','cspriority'];
  csprompts: string[] = ['Search by Topic','Requset/Feedback', 'Search by Rating','Search by Priority'];

  public csearch!: FormGroup;
  public ssearch!: FormGroup;
  public form!: FormGroup;

  selectedFileName!: string;
  reviewObj!: Review;
  reviewOldObj!: Review| undefined;

  selectedRow: any;


  enaadd:boolean =false;
  enaupd:boolean =false;
  enadel:boolean =false;

  reviews: Array<Review> = [];
  imageurl : string = '';
  data!: MatTableDataSource<Review>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  imgeTeachurl: string = 'assets/userold.png';

  //Supportive Arrays
  reviewstatuses: Array<Reviewstatus> = [];
  reviewtypes: Array<Reviewtype> = [];
  isreviews: Array<Isreview> = [];
  reviewratings: Array<Reviewrating> = [];
  reviewpriorities: Array<Noticepriority> = [];

  regexes: any;

  uiassist: UiAssist;

  constructor(private reviewservice: Reviewservice,
              private fb: FormBuilder,
              private reviewstatuservice: Reviewstatuservice,
              private reviewratingservice: Reviewratingservice,
              private reviewtypeservice: Reviewtypeservice,
              private isreviewservice: Isreviewservice,
              private noticepriorityservice: Noticepriorityservice,
              private matDialog: MatDialog,
              private regexservice: Regexservice,
              private dp: DatePipe,
  ) {

    this.uiassist = new UiAssist(this);

    //Client search form Group
    this.csearch = this.fb.group({
      'cstopic': new FormControl(),
      'csisreview': new FormControl(),
      'csrating': new FormControl(),
      'cspriority': new FormControl(),
    });

    const today = new Date();
    console.log( today.toISOString())
    const formattedDate = today.toISOString().split("T")[0];

    this.form= this.fb.group({
      'topic': new FormControl('',[Validators.required]),
      'toreview': new FormControl(this.dp.transform(Date.now(),"hh:mm:ss"),[Validators.required]),
      'message': new FormControl('',[Validators.required]),
      'doreview': new FormControl({value:formattedDate, disabled: false},[Validators.required]),
      'domodified': new FormControl({value: null, disabled: true},[Validators.required]),
      'isreview': new FormControl('',[Validators.required]),
      'reviewtype': new FormControl(null,[Validators.required]),
      'reviewrating': new FormControl(null,[Validators.required]),
      'reviewstatus': new FormControl(null,[Validators.required]),
      'reviewpriority': new FormControl(null,[Validators.required]),
    });
  }
  //Table filter method according to a client search method
  filterTable(): void {

    const csearchdata = this.csearch.getRawValue();

    // @ts-ignore
    this.data.filterPredicate = (review: Review, filter: string)=>{
      return(csearchdata.cspriority==null||review.reviewpriority.name.toLowerCase().includes(csearchdata.cspriority))&&
       (csearchdata.csisreview==null||review.isreview.name.toLowerCase().includes(csearchdata.csisreview))&&
        (csearchdata.cstopic==null||review.topic.toLowerCase().includes(csearchdata.cstopic))&&
        (csearchdata.csrating==null||review.reviewrating.name.toLowerCase().includes(csearchdata.csrating));

    }
    this.data.filter="xx";
  }

  getDate(element: Review) {
    return this.dp.transform(element.doreview,'yyyy-MM-dd');
  }

  // All the data load in initial stage
  createView() {
    this.imageurl='assets/pending.gif';
    this.loadTable("");
  }

  // Load the Main Table data
  loadTable(query:string){
    this.reviewservice.getAll(query)
      .then((teach: Review[]) => {this.reviews=teach;
        console.log(this.reviews); this.imageurl='assets/fullfilled.png';})
      .catch((error) => {console.log(error); this.imageurl='assets/rejected.png';})
      .finally(()=> {this.data = new MatTableDataSource(this.reviews); this.data.paginator=this.paginator;});
  }

  ngOnInit(){

    this.initialize();
  }


  initialize() {
    this.createView();

    this.reviewstatuservice.getAllList().then((status: Reviewstatus[]) =>{this.reviewstatuses = status;});
    this.reviewratingservice.getAllList().then((ratings: Reviewrating[]) =>{this.reviewratings = ratings;});
    this.reviewtypeservice.getAllList().then((types: Reviewtype[]) =>{this.reviewtypes = types;});
    this.isreviewservice.getAllList().then((reviews: Isreview[]) =>{this.isreviews = reviews;});
    // @ts-ignore
    this.noticepriorityservice.getAllList().then((priority: Noticepriority[]) =>{this.reviewpriorities = priority;});
    this.regexservice.get('review').then((regs: []) =>{
      this.regexes = regs;
      // console.log("R" + this.regexes['email']['regex']);
      this.createForm();
    });

  }
  //Active Disabled form
  loadform(id: number) {
    this.form.controls['reviewrating'].enable();
    if (id ==1){
      this.form.controls['reviewtype'].disable();
      this.form.controls['reviewstatus'].disable();
      this.form.controls['reviewpriority'].disable();
  }if (id ==2) {
      this.form.controls['reviewrating'].disable();
      this.form.controls['reviewtype'].enable();
      this.form.controls['reviewstatus'].enable();
      this.form.controls['reviewpriority'].enable();
    }

  }

  //Validate All form field
  createForm() {

    this.form.controls['topic'].setValidators([Validators.required, Validators.pattern(this.regexes['topic']['regex'])]);
    this.form.controls['toreview'].setValidators([Validators.required]);
    this.form.controls['message'].setValidators([Validators.required,Validators.pattern(this.regexes['message']['regex'])]);
    this.form.controls['doreview'].setValidators([Validators.required]);
    this.form.controls['domodified']?.setValidators([Validators.required]);
    this.form.controls['isreview'].setValidators([Validators.required]);
    this.form.controls['reviewtype'].setValidators([Validators.required]);
    this.form.controls['reviewrating'].setValidators([Validators.required]);
    this.form.controls['reviewstatus'].setValidators([Validators.required]);
    this.form.controls['reviewpriority'].setValidators([Validators.required]);

    Object.values(this.form.controls).forEach(control=>{control.markAsTouched();});

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];

      control.valueChanges.subscribe(value => {
        // @ts-ignore
        if(controlName=="dopublished" || controlName=="doreview" || controlName=="domodified")
          value = this.dp.transform(new Date(value), 'yyyy-MM-dd');


        if (this.reviewOldObj != undefined && control.valid){
          // @ts-ignore
          if (value === this.reviewObj[controlName]){ control.markAsPristine(); }
          else { control.markAsDirty(); }
        }
        else{ control.markAsPristine(); }
      });
    }
    this.enaleButtons(true,false,false);

  }

  // //Server search form add button
  // btnSearchMc() {
  //
  //   const sserchdata = this.ssearch.getRawValue();
  //
  //   let callingname = sserchdata.sscallingname;
  //   let nic = sserchdata.ssnic;
  //   let genderid = sserchdata.ssgender;
  //   let statusid = sserchdata.ssStatus;
  //
  //   let query = '';
  //
  //   if (callingname != null && callingname.trim() != "") query+="&callingname="+callingname;
  //   if (nic != null && nic.trim() != "") query+="&nic="+nic;
  //   if (genderid != null) query+="&genderid="+genderid;
  //   // if (email != null && email.trim() != "") query+="&email="+email;
  //   if (statusid != null) query+="&statusid="+statusid;
  //
  //   if (query !="") query = query.replace(/^./,"?");
  //
  //   console.log(query);
  //
  //   this.loadTable(query);
  //
  // }
  //
  // //Server search form clear button
  // btnSearchClearMc() {
  //   // @ts-ignore
  //   const cofirm = this.matDialog.open(ConfirmComponent,{
  //     with: '500px',
  //     data: {heading: "Search Clear", message: "Are you sure to clear the Search?"}
  //   });
  //
  //   cofirm.afterClosed().subscribe(async result => {
  //     if (result){
  //       this.ssearch.reset();
  //       this.loadTable("");
  //     }
  //   });
  // }

  clearMainForm(){
    this.reviewOldObj = undefined;
    this.form.controls['topic'].reset();
    this.form.controls['message'].reset();
    this.form.controls['isreview'].reset();
    this.form.controls['reviewtype'].reset();
    this.form.controls['reviewrating'].reset();
    this.form.controls['reviewrating'].reset()
    this.form.controls['reviewstatus'].reset();
    this.form.controls['reviewpriority'].reset();
    this.form.controls['domodified'].reset();
  }


  //Review Add method
  add(){
    let errors = this.getErrors();
    if(errors!=""){
      const errmsg = this.matDialog.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Review Add ", message: "You have following Errors <br> "+errors}
      });
      errmsg.afterClosed().subscribe(async result => { if (!result) { return; } });
    }
    else{
      this.reviewObj = this.form.getRawValue();

      let reviewData: string = "";
      reviewData = reviewData + "<br>Title is : "+ this.reviewObj.topic;
      const confirm = this.matDialog.open(ConfirmComponent, {
        width: '500px',
        data: {heading: "Confirmation - Review Add",
          message: "Are you sure to Add the folowing Staff? <br> <br>"+ reviewData}
      });
      let addstatus:boolean=false;
      let addmessage:string="Server Not Found";
      confirm.afterClosed().subscribe(async result => {
        if(result){
          // console.log("StaffService.add(emp)");
          // @ts-ignore
          this.reviewservice.add(this.reviewObj).then((responce: []|undefined) => {
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
              this.form.controls['domodified'].disable();
              this.form.controls['reviewrating'].enable();
              this.form.controls['reviewtype'].enable();
              this.form.controls['reviewstatus'].enable();
              this.form.controls['reviewpriority'].enable();
              this.clearMainForm();
              Object.values(this.form.controls).forEach(control => {
                control.markAsTouched();
              });
              this.enaleButtons(true,false,false,);
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

  enaleButtons(add:boolean, upd:boolean, del:boolean){
    this.enaadd = add;
    this.enaupd = upd;
    this.enadel = del;
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
  fillForm(review: Review){
    this.form.controls['domodified'].enable();
    this.form.controls['doreview'].disable();
    this.form.controls['toreview'].disable();

    if (review.isreview.id == 1){
      this.enableField1();
    }else {
      this.enableField2();
    }
    this.enaleButtons(false,true,true);

    this.selectedRow=review;

    this.reviewObj = JSON.parse(JSON.stringify(review));
    this.reviewOldObj = JSON.parse(JSON.stringify(review));

    // @ts-ignore
    this.reviewObj.isreview = this.isreviews.find(ir=> ir.id === this.reviewObj.isreview.id);
    // @ts-ignore
    if (this.reviewObj.reviewpriority.name == "N/A" && this.reviewObj.reviewtype.name == "N/A" && this.reviewObj.reviewstatus.name == "N/A" ){

      // @ts-ignore
      this.reviewObj.reviewrating = this.reviewratings.find(rr=> rr.id === this.reviewObj.reviewrating.id);
      // @ts-ignore
      this.form.patchValue(this.reviewObj);
      this.form.markAsPristine();
    }else {
      // @ts-ignore
      this.reviewObj.reviewpriority = this.reviewpriorities.find(rp=> rp.id === this.reviewObj.reviewpriority.id);
      // @ts-ignore
      this.reviewObj.reviewtype = this.reviewtypes.find(rt=> rt.id === this.reviewObj.reviewtype.id);

      // @ts-ignore
      this.reviewObj.reviewstatus = this.reviewstatuses.find(rs=> rs.id === this.reviewObj.reviewstatus.id);

      this.form.patchValue(this.reviewObj);
      this.form.markAsPristine();

    }
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

  //Update Review
  update() {
    let errors = this.getErrors();
    if (errors != "") {
      const errmsg = this.matDialog.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Review Update ", message: "You have following Errors <br> " + errors}
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
            this.reviewObj = this.form.getRawValue();
            // @ts-ignore
            if (this.reviewObj.reviewpriority.name == "N/A"){
              // @ts-ignore
              this.reviewObj.reviewpriority = null;
              // @ts-ignore
              this.reviewObj.reviewtype = null;
              // @ts-ignore
              this.reviewObj.reviewstatus = null;
            }else {
              // @ts-ignore
              this.reviewObj.reviewrating = null;
            }
            console.log(this.reviewObj)
            const inputField = document.getElementById("toreviewtimeInput");
            // @ts-ignore
            const startinputValue = inputField.value;

            const timeComponents = startinputValue.split(':');
            const hours = timeComponents[0];
            const minutes = timeComponents[1];
            const seconds = "00";
            this.reviewObj.toreview = `${hours}:${minutes}:${seconds}`;

            // @ts-ignore
            this.reviewObj.id = this.reviewOldObj.id;
            this.reviewservice.update(this.reviewObj).then((responce: [] | undefined) => {
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
                this.form.controls['doreview'].enable();
                this.form.controls['toreview'].enable();
                this.allEnable();
                this.clearMainForm();
                Object.values(this.form.controls).forEach(control => { control.markAsTouched(); });
                this.enaleButtons(true,false,false);
                this.loadTable("");
              }
              const stsmsg = this.matDialog.open(MessageComponent, {
                width: '500px',
                data: {heading: "Status -Review Update", message: updmessage}
              });
              stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });
            });
          }
        });
      }
      else {
        const updmsg = this.matDialog.open(MessageComponent, {
          width: '500px',
          data: {heading: "Confirmation - Review Update", message: "Nothing Changed"}
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
        this.form.controls['doreview'].enable();
        this.form.controls['toreview'].enable();
        this.allEnable();
       this.clearMainForm();
        Object.values(this.form.controls).forEach(control => { control.markAsTouched(); });
        this.loadTable("");
        this.enaleButtons(true,false,false);

      }
    });
  }

//Delete Review

  delete() {
    const confirm = this.matDialog.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Review Delete",
        message: "Are you sure to Delete folowing Member? <br> <br>" +
          this.reviewObj.topic
      }
    });
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";
        // @ts-ignore
        this.reviewservice.delete(this.reviewObj.id).then((responce: [] | undefined) => {
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
            this.form.controls['doreview'].enable();
            this.form.controls['toreview'].enable();
            this.allEnable();
            this.clearMainForm();
            Object.values(this.form.controls).forEach(control => {
              control.markAsTouched();
            });
            this.enaleButtons(true,false,false);
            this.loadTable("");

          }
          const stsmsg = this.matDialog.open(MessageComponent, {
            width: '500px',
            data: {heading: "Status - Review Delete ", message: delmessage}
          });
          stsmsg.afterClosed().subscribe(async result => { if (!result) { return; }
          });
        });
      }
    });
  }

  enableField1(){
    this.form.controls['reviewrating'].enable();
    this.form.controls['reviewtype'].disable();
    this.form.controls['reviewstatus'].disable();
    this.form.controls['reviewpriority'].disable();
  }
  enableField2(){
    this.form.controls['reviewrating'].disable();
    this.form.controls['reviewtype'].enable();
    this.form.controls['reviewstatus'].enable();
    this.form.controls['reviewpriority'].enable();
  }
  allEnable(){
    this.form.controls['reviewrating'].enable();
    this.form.controls['reviewtype'].enable();
    this.form.controls['reviewstatus'].enable();
    this.form.controls['reviewpriority'].enable();
  }
}
