import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Progress} from "../../../entity/progress";
import {Grade} from "../../../entity/grade";
import {Gradetype} from "../../../entity/gradetype";
import {Teacher} from "../../../entity/teacher";
import {Subject} from "../../../entity/subject";
import {Sublevel} from "../../../entity/sublevel";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {UiAssist} from "../../../util/ui.assist/ui.assist";
import {Teacherservice} from "../../../service/teacherservice";
import {Progresseservice} from "../../../service/progressservice";
import {Gradetypeservice} from "../../../service/gradetypeservice";
import {Gradeservice} from "../../../service/gradeservice";
import {Subjectservice} from "../../../service/subjectservice";
import {Sublevelservice} from "../../../service/sublevelservice";
import {DatePipe} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {Regexservice} from "../../../service/regexservice";
import {Progressreviewservice} from "../../../service/progressreviewservice";
import {Progressreview} from "../../../entity/progressreview";
import {Schassign} from "../../../entity/schassign";
import {Schassignservice} from "../../../service/schassignservice";
import {Staff} from "../../../entity/staff";
import {Directorsubject} from "../../../entity/directorsubject";
import {Directorsubjectservice} from "../../../service/directorsubjectservice";
import {Reviewrating} from "../../../entity/reviewrating";
import {Reviewratingservice} from "../../../service/reviewratingservice";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {AuthorizationManager} from "../../../service/authorizationmanager";

@Component({
  selector: 'app-progressreview',
  templateUrl: './progressreview.component.html',
  styleUrls: ['./progressreview.component.css']
})
export class ProgressreviewComponent {



  columns: string[] = ['directorsubject','teacher','subject','sublevel','comment','topic','description','reviewrating','docreated','domodified'];
  headers: string[] = ['Director Name','Teacher-Name','Subject-Name','Subject-topic','Progress-Description','Subject-Level','Comment','Rating','Date of Created','Date of Modified'];
  binders: string[] = ['directorsubject.staff.fullname','progress.teacher.fullname','progress.schassign.subject.name','progress.topic','progress.description','progress.schassign.subject.sublevel.name','comment','reviewrating.name','docreated','domodified'];

  cscolumns: string[] = [ 'csdirectorsubject','cssubject','cssublevel','cscomment'];
  csprompts: string[] = ['Search by Director name','Search by Subject', 'Search by Subject-level','Search by Comment'];

  public csearch!: FormGroup;
  public ssearch!: FormGroup;
  public form!: FormGroup;

  progressreviewObj!:Progressreview;
  oldprogressreviewObj!:Progressreview|undefined;

  progressObj!: Progress;

  selectedRow: any;
  fileName = '';
  file!: FormData;
  file2!:File;

  grades: Array<Grade> = [];
  gradetypes: Array<Gradetype> = [];
  teachers: Array<Teacher> = [];
  progressess: Array<Progress> = [];
  progressess1: Array<Progress> = [];
  subjects: Array<Subject> = [];
  sublevels: Array<Sublevel> = [];
  schassigns: Array<Schassign> = [];
  reviewratings: Array<Reviewrating> = [];
  directorsubjects: Array<Directorsubject> = [];

  progressreviews: Array<Progressreview> = [];
  data!: MatTableDataSource<Progressreview>;
  imageurl: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  imgeTeachurl: string = 'assets/userold.png';

  enaadd:boolean = false;
  enaupd:boolean = false;
  enadel:boolean = false;


  uiassist: UiAssist;
  regexes: any;

  constructor(
    private fb:FormBuilder,
    private teacherservice:Teacherservice,
    private progressreviewservice:Progressreviewservice,
    private schassignservice:Schassignservice,
    private directorsubjectservice:Directorsubjectservice,
    private progresseservice:Progresseservice,
    private gradetypeservice: Gradetypeservice,
    private gradeservice: Gradeservice,
    private subjectservice: Subjectservice,
    private sublevelservice: Sublevelservice,
    private reviewratingservice : Reviewratingservice,
    private dp:DatePipe,
    private dg:MatDialog,
    private regexservice:Regexservice,
    private matDialog: MatDialog,
    public authService:AuthorizationManager
  ) {

    this.uiassist = new UiAssist(this);
    this.progressreviews = new Array<Progressreview>();

    this.csearch = this.fb.group({
      "csdirectorsubject": new FormControl(),
      "cssublevel": new FormControl(),
      "cssubject": new FormControl(),
      "cscomment": new FormControl(),

    });

    const today = new Date();
    console.log( today.toISOString())
    const formattedDate = today.toISOString().split("T")[0];

    this.form = this.fb.group({
      'teacher': new FormControl('',[Validators.required]),
      "directorsubject": new FormControl('',[Validators.required]),
      'subject': new FormControl('',[Validators.required]),
      'file': new FormControl(),
      'progress': new FormControl('',[Validators.required]),
      'sublevel': new FormControl('',[Validators.required]),
      'description': new FormControl('',[Validators.required]),
      'topic': new FormControl('',[Validators.required]),
      'comment': new FormControl('',[Validators.required]),
      "reviewrating": new FormControl('',[Validators.required]),
      "docreated": new FormControl({value:formattedDate, disabled: false},[Validators.required]),
      'domodified': new FormControl({value: null, disabled: true},[Validators.required]),
      'dofrom': new FormControl('',[Validators.required]),
      'tofrom': new FormControl('',[Validators.required])
    });

    this.ssearch = this.fb.group({
      "sslevel": new FormControl(),
      "ssubject": new FormControl(),
    });

  }

  ngOnInit() {
    this.initialize();
  }


  initialize() {
    this.createView();

    this.reviewratingservice.getAllList().then((ratings: Reviewrating[]) =>{this.reviewratings = ratings;});

    this.sublevelservice.getAllList().then((secs:Sublevel[])=>{
      this.sublevels = secs;

      this.regexservice.get('progressreview').then((regs: []) =>{
        this.regexes = regs;
        this.createForm();
      });
    });
  }

  //Subject Load
  loadSubject(id: number) {
    // @ts-ignore
    this.subjectservice.getById(id).then((subs: Subject[]) =>{
      this.subjects = subs;
    });
  }

  loadOptions(id: number) {
    // @ts-ignore
    this.directorsubjectservice.getBySubjectId(id).then((directors: Directorsubject[]) =>{this.directorsubjects = directors ;});
    this.progresseservice.getByTeachers(id).then((pro: Progress[]) =>{
      this.progressess = pro;
    });

  }

  loadSchool(id: number) {
    this.progresseservice.getByschool(id).then((pro: Progress[]) =>{
      this.progressess1 = pro;
      this.imgeTeachurl =  atob(this.progressess1[0]?.file);

      this.form.controls['dofrom'].setValue(this.dp.transform(this.progressess1[0].dofrom, 'yyyy-MM-dd'));
      this.form.controls['tofrom'].setValue(this.dp.transform(this.progressess1[0].tofrom, 'yyyy-MM-dd'));

    });
  }
  createView() {
    this.imageurl = 'assets/pending.gif';
    this.loadTable("");
  }


  enaleButtons(add:boolean, upd:boolean, del:boolean){
    this.enaadd = add;
    this.enaupd = upd;
    this.enadel = del;
  }

  loadTable(query: string) {

    this.progressreviewservice.getAll(query)
      .then((usrs: Progressreview[]) => {
        this.progressreviews = usrs;
         console.log(this.progressreviews)
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.progressreviews);
        this.data.paginator = this.paginator;
      });
  }


  loadProgress(id: number) {
    console.log(id);
    this.progresseservice.getByTeachers(id).then((pro: Progress[]) =>{
      this.progressess = pro;
    });
  }

  clearImage():void{
    this.imgeTeachurl='assets/userold.png';
  }


  clearMainForm(){

    const today = new Date();
    console.log( today.toISOString())
    const formattedDate = today.toISOString().split("T")[0];

    this.oldprogressreviewObj = undefined;
    this.form.controls['teacher'].reset();
    this.form.controls['directorsubject'].reset();
    this.form.controls['progress'].reset();
    this.form.controls['file'].reset();
    this.form.controls['subject'].reset();
    this.form.controls['sublevel'].reset();
    this.form.controls['domodified'].reset();
    this.form.controls['reviewrating'].reset();
    this.form.controls['description'].reset();
    this.form.controls['topic'].reset();
    this.form.controls['docreated'].setValue(formattedDate);
    this.form.controls['comment'].reset();
    this.form.controls['dofrom'].reset();
    this.form.controls['tofrom'].reset();
   }

  createForm() {
    this.form.controls['teacher'].setValidators([Validators.required]);
    this.form.controls['directorsubject'].setValidators([Validators.required]);
    this.form.controls['file'].setValidators([]);
    this.form.controls['subject'].setValidators([Validators.required]);
    this.form.controls['sublevel'].setValidators([Validators.required]);
    this.form.controls['progress'].setValidators([Validators.required]);
    this.form.controls['docreated'].setValidators([Validators.required]);
    this.form.controls['domodified'].setValidators([Validators.required]);
    this.form.controls['reviewrating'].setValidators([Validators.required]);
    this.form.controls['topic'].setValidators([Validators.required]);
    this.form.controls['comment'].setValidators([Validators.required,Validators.pattern(this.regexes['comment']['regex'])]);
    this.form.controls['description'].setValidators([Validators.required]);


    Object.values(this.form.controls).forEach( control => { control.markAsTouched(); } );

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {
          // @ts-ignore
          if (controlName == "docreated"|| controlName == "domodified")
            value = this.dp.transform(new Date(value), 'yyyy-MM-dd');

          if (this.oldprogressreviewObj != undefined && control.valid) {
            // @ts-ignore
            if (value === this.progressreviewObj[controlName]) {
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

    this.enaleButtons(true,false,false);

  }

  filterTable(): void {

    const cserchdata = this.csearch.getRawValue();

    this.data.filterPredicate = (div: Progressreview, filter: string) => {

      return (cserchdata.csdirectorsubject == null || div.directorsubject.staff.fullname.toLowerCase().includes(cserchdata.csdirectorsubject))&&
        (cserchdata.cssublevel == null || div.directorsubject.subject.sublevel.name.toLowerCase().includes(cserchdata.cssublevel))&&
         (cserchdata.cssubject == null || div.directorsubject.subject.name.toLowerCase().includes(cserchdata.cssubject))&&
        (cserchdata.cscomment == null || div.comment.toLowerCase().includes(cserchdata.cscomment));

    };

    this.data.filter = 'xx';

  }

  fillForm(progressreview: Progressreview){

    this.form.controls['domodified'].enable();
    this.form.controls['docreated'].disable();
    this.form.controls['teacher'].enable();

    this.enaleButtons(false,true,true);
    //
    this.selectedRow=progressreview;
    console.log(this.selectedRow)
    this.progressreviewObj = JSON.parse(JSON.stringify(progressreview));
    // console.log(this.progressOBj)
    this.oldprogressreviewObj = JSON.parse(JSON.stringify(progressreview));


    if (this.progressreviewObj.progress.file != null){
      // @ts-ignore
      this.imgeTeachurl = atob(this.progressreviewObj.progress.file);
      this.form.controls['file'].clearValidators();
    }else {
      // @ts-ignore
      this.clearImage();
    }

    this.progressreviewObj.progress.file = "";

    // @ts-ignore
    this.progressreviewObj.reviewrating = this.reviewratings.find(rating=> rating.id === this.progressreviewObj.reviewrating.id);

    // @ts-ignore
    this.progressreviewObj.sublevel = this.sublevels.find(sublevel=>sublevel.id === this.progressreviewObj.directorsubject.subject.sublevel.id);
    // @ts-ignore
     this.subjectservice.getById(this.progressreviewObj.directorsubject.subject.sublevel.id).then((tech: Subject[]) =>{
       this.subjects = tech;
      // @ts-ignore
      this.progressreviewObj.subject = this.subjects.find(sc=>sc.id === this.progressreviewObj.directorsubject.subject.id);

       this.directorsubjectservice.getBySubjectId(this.progressreviewObj.directorsubject.subject.id).then((tech: Directorsubject[]) =>{
         this.directorsubjects = tech;

         // @ts-ignore
         this.progressreviewObj.directorsubject = this.directorsubjects.find(ds => ds.staff.id === this.progressreviewObj.directorsubject.staff.id)

         this.progresseservice.getByTeachers(this.progressreviewObj.directorsubject.subject.id).then((tech: Progress[]) =>{
           this.progressess = tech;
           // @ts-ignore
           this.progressreviewObj.teacher = this.progressess.find(ds => ds.teacher.id === this.progressreviewObj.progress.teacher.id);


           this.progresseservice.getByschool(this.progressreviewObj.progress.teacher.id).then((tech: Progress[]) =>{
             this.progressess1 = tech;
             this.form.controls['dofrom'].setValue(this.dp.transform(this.progressess1[0].dofrom, 'yyyy-MM-dd'));
             this.form.controls['tofrom'].setValue(this.dp.transform(this.progressess1[0].tofrom, 'yyyy-MM-dd'));

             // @ts-ignore
             this.progressreviewObj.progress = this.progressess1.find(ds => ds.schassign.school.id === this.progressreviewObj.progress.schassign.school.id);

             // @ts-ignore
             this.progressreviewObj.topic = this.progressess1.find(ds => ds.topic === this.progressreviewObj.progress.topic);

             // @ts-ignore
             this.progressreviewObj.description = this.progressess1.find(ds => ds.description === this.progressreviewObj.progress.description);

            // console.log(this.progressreviewObj.progress.dofrom);
             console.log(this.progressess.find(ds => ds.dofrom));

             // // @ts-ignore
             // this.progressreviewObj.dofrom = this.progressess.find(ds => ds.dofrom === this.progressreviewObj.progress.dofrom);
             // // @ts-ignore
             // this.progressreviewObj.tofrom = this.progressess.find(ds => ds.tofrom === this.progressreviewObj.progress.tofrom);

             console.log(this.progressreviewObj);

             if (this.progressreviewObj.domodified != null) {
               // @ts-ignore
               this.progressreviewObj.domodified = null;
               this.form.patchValue(this.progressreviewObj);
               this.form.markAsPristine();
             } else {
               this.form.patchValue(this.progressreviewObj);
               this.form.markAsPristine();
             }
           });
         });
       });
     });
  }

  getErrors(): string {

    let errors: string = "";

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      if (control.errors) errors = errors + "<br>Invalid " + controlName;
    }

    return errors;
  }

  add(){
    let errors = this.getErrors();
    if(errors!=""){
      const errmsg = this.matDialog.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Progress Add ", message: "You have following Errors <br> "+errors}
      });
      errmsg.afterClosed().subscribe(async result => { if (!result) { return; } });
    }
    else{
      this.progressreviewObj = this.form.getRawValue();

      let progressData: string = "";
      progressData = progressData + "<br>Title is : "+ this.progressreviewObj.directorsubject.staff.fullname;
      progressData = progressData + "<br>Fullname is : "+ this.progressreviewObj.progress.teacher.fullname;
      const confirm = this.matDialog.open(ConfirmComponent, {
        width: '500px',
        data: {heading: "Confirmation - Progress Add",
          message: "Are you sure to Add the folowing Staff? <br> <br>"+ progressData}
      });
      let addstatus:boolean=false;
      let addmessage:string="Server Not Found";
      confirm.afterClosed().subscribe(async result => {
        if(result){
          console.log(this.progressreviewObj)
          // console.log("StaffService.add(emp)");
          // @ts-ignore
          this.progressreviewservice.add(this.progressreviewObj).then((responce: []|undefined) => {
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
              this.clearImage();
              this.clearMainForm();
              Object.values(this.form.controls).forEach(control=>{control.markAsTouched();});
              this.enaleButtons(true,false,false);
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

  //Update Progress
  update() {
    let errors = this.getErrors();
    if (errors != "") {
      const errmsg = this.matDialog.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Progress Update ", message: "You have following Errors <br> " + errors}
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
            this.progressreviewObj = this.form.getRawValue();

            // @ts-ignore
            this.progressreviewObj.id = this.oldprogressreviewObj.id;
            this.progressreviewservice.update(this.progressreviewObj).then((responce: [] | undefined) => {
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
                this.clearImage();
                this.form.controls['domodified'].disable();
                this.form.controls['docreated'].enable();
                this.clearMainForm();
                Object.values(this.form.controls).forEach(control=>{control.markAsTouched();});
                this.enaleButtons(true,false,false);
                this.loadTable("");
              }
              const stsmsg = this.matDialog.open(MessageComponent, {
                width: '500px',
                data: {heading: "Status -Progress Update", message: updmessage}
              });
              stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });
            });
          }
        });
      }
      else {
        const updmsg = this.matDialog.open(MessageComponent, {
          width: '500px',
          data: {heading: "Confirmation - Progress Update", message: "Nothing Changed"}
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
        this.clearMainForm();
        this.clearImage();
        this.form.controls['domodified'].disable();
        this.form.controls['docreated'].enable();
        Object.values(this.form.controls).forEach(control=>{control.markAsTouched();});
        this.enaleButtons(true,false,false);
        this.loadTable("");
      }
    });
  }

//Delete Progress
  delete() {
    const confirm = this.matDialog.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Progress Delete",
        message: "Are you sure to Delete folowing Member? <br> <br>" +
          this.progressreviewObj.progress.teacher.fullname
      }
    });
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";
        // @ts-ignore
        this.progressreviewservice.delete(this.progressreviewObj.id).then((responce: [] | undefined) => {
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
            this.form.controls['docreated'].enable();
            this.clearMainForm();
            this.clearImage();
            Object.values(this.form.controls).forEach(control=>{control.markAsTouched();});
            this.enaleButtons(true,false,false);
            this.loadTable("");

          }
          const stsmsg = this.matDialog.open(MessageComponent, {
            width: '500px',
            data: {heading: "Status - Progress Delete ", message: delmessage}
          });
          stsmsg.afterClosed().subscribe(async result => { if (!result) { return; }
          });
        });
      }
    });
  }

  print() {
    if (this.progressreviewObj != null){
      // Get the base64 image data from the 'file' form control
      this.imgeTeachurl = atob(this.progressreviewObj.progress.file);

      // Get the values of other form controls
      const directorsubject = this.form.controls['directorsubject'].value;
      const progress = this.form.controls['progress'].value;
      const reviewrating = this.form.controls['reviewrating'].value;

      // Get the current date in a formatted string
      const formattedDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      // Create the print content
      const printContent = `
    <html>
    <head>
      <style>
        h1 {
          text-align: center;
          font-size: 30px;
        }
        img {
          display: block;
          margin: 0 auto;
          max-height: 300px;
          max-width: 300px;
          margin-top: 20px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          border: 1px solid black;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f2f2f2;
        }
      </style>
    </head>
    <body>
      <h1>Zonal Office Akuressa</h1>
      <h2>Progress Review Report</h2>
      <img src="${this.imgeTeachurl}" alt="Photo">
      <br><br>
      <table>

        <tr>
          <th>Director Subject:</th>
          <td>${directorsubject.staff.fullname}</td>
        </tr>
        <tr>
          <th>Teacher:</th>
          <td>${progress.teacher.fullname}</td>
        </tr>
        <tr>
          <th>Subject:</th>
          <td>${directorsubject.subject.name}</td>
        </tr>
        <tr>
          <th>Sublevel:</th>
          <td>${directorsubject.subject.sublevel.name}</td>
        </tr>
        <tr>
          <th>Review Rating:</th>
          <td>${reviewrating.name}</td>
        </tr>
        <tr>
          <th>Description:</th>
          <td>${progress.description}</td>
        </tr>
        <tr>
          <th>Topic:</th>
          <td>${progress.topic}</td>
        </tr>
      </table>
      <p>Date: ${formattedDate}</p>
      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 1000); // Delay of 1 second (adjust as needed)
        };
      </script>
    </body>
    </html>
  `;

      // Create a new window to display the print content
      const printWindow = window.open('', '_blank');

      // Write the print content to the new window
      // @ts-ignore
      printWindow.document.open();
      // @ts-ignore
      printWindow.document.write(printContent);
      // @ts-ignore
      printWindow.document.close();
    }
    this.progressreviewObj  == null;
    }

}
