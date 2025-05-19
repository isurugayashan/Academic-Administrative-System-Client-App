import {Component, ViewChild} from '@angular/core';
import {Item} from "../../../entity/item";
import {Itemservice} from "../../../service/itemservice";
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
import {Prostatus} from "../../../entity/prostatus";
import {Procategory} from "../../../entity/procategory";
import {Staffdesignation} from "../../../entity/staffdesignation";
import {Staff} from "../../../entity/staff";
import {Itemcategory} from "../../../entity/itemcategory";
import {Itemstatus} from "../../../entity/itemstatus";
import {Section} from "../../../entity/section";
import {Itemcategoryservice} from "../../../service/itemcategoryservice";
import {Itemstatusservice} from "../../../service/itemstatusservice";
import {Sectionservice} from "../../../service/sectionservice";
import {Staffservice} from "../../../service/staffservice";
import {Meeting} from "../../../entity/meeting";
import {Divisionservice} from "../../../service/divisionservice";
import {Teacher} from "../../../entity/teacher";


@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css'],
})
export class ItemComponent {
  cols = "12";

  //Table columns
  columns: string[] = ['itemcode','name','quentity','unitptice','totalcost','lossitem','purchasedate','supplier', 'itemstatus','section','division','warrenty'];
  headers: string[] = ['Item-Code','Item-Name','Item-Quantity','Unit-Ptice','Total-Cost','Loss-Count', 'Purchase-Date','Supplier','Item-Status','Section','Division','Warranty'];
  binders: string[] = ['itemcode','name','quentity','unitprice','getModi()','lossitem','purchasedate','supplier', 'itemstatus.name','getSection()','getDivision()','warrenty'];

  //Client Search columns
  cscolumns: string[] = ['cscode','csquentity','cssupplier','cswarranty'];
  csprompts: string[] = ['Search by Item-Code', 'Search by Quantities','Search by Supplier-Name','Search by Warranty Period'];

  public csearch!: FormGroup;
  public ssearch!: FormGroup;
  public form!: FormGroup;

  itemObj!: Item;
  olditemObj!: Item| undefined;

  selectedRow: any;

  enaadd:boolean =false;
  enaupd:boolean =false;
  enadel:boolean =false;
  enprint:boolean =false;

  item: Array<Item> = [];
  data!: MatTableDataSource<Item>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  imageurl : string = '';

  //Supportive Arrays
  itemstatuses: Array<Itemstatus> = [];
  itemcategories: Array<Itemcategory> = [];
  staffCreators: Array<Staff> = [];
  sections: Array<Section> = [];
  divisions: Array<Division> = [];

  regexes: any;

  uiassist: UiAssist;


  constructor(private itemservice: Itemservice,
              private itemcategoryservice: Itemcategoryservice,
              private itemstatusservice: Itemstatusservice,
              private sectionservice: Sectionservice,
              private divisionservice: Divisionservice,
              private fb: FormBuilder,
              private matDialog: MatDialog,
              private regexservice: Regexservice,
              private staffservice: Staffservice,
              private dp: DatePipe) {

    this.uiassist = new UiAssist(this);


    //Server search form Group
    this.ssearch = this.fb.group({
      'ssName': new FormControl(),
      'ssStatus': new FormControl(),
      'ssSection': new FormControl(),
      'ssCategory': new FormControl(),
    });

    //Client search form Group
    this.csearch = this.fb.group({
      'cscode': new FormControl(),
      'csquentity': new FormControl(),
      'cssupplier': new FormControl(),
      'cswarranty': new FormControl(),
    });

    const today = new Date();
    console.log(today)
    const formattedDate = today.toISOString().split("T")[0];

    this.form= this.fb.group({
      'itemcode': new FormControl('',[Validators.required]),
      'name': new FormControl('',[Validators.required]),
      'quentity': new FormControl('',[Validators.required]),
      'purchasedate': new FormControl(formattedDate,[Validators.required]),
      'description': new FormControl(''),
      'warrenty': new FormControl('',[Validators.required]),
      'supplier': new FormControl('',[Validators.required]),
      'supplieraddress': new FormControl('',[Validators.required]),
      'itemstatus': new FormControl('',[Validators.required]),
      'section': new FormControl(),
      'staffCreator': new FormControl('',[Validators.required]),
      'itemcategory': new FormControl('',[Validators.required]),
      'totalcost': new FormControl({ value: 0, disabled: true },[Validators.required]),
      'unitprice': new FormControl('',[Validators.required]),
      'division': new FormControl(),
      'lossitem': new FormControl({ value: 0, disabled: true }),
      'loss': new FormControl({ value: 0, disabled: true }),

    });
  }


  createSearch() {}

  //Validate All form field
  createForm() {
    this.form.controls['itemcode']?.setValidators([Validators.required, Validators.pattern(this.regexes['itemcode']['regex'])]);
    this.form.controls['name']?.setValidators([Validators.required,Validators.pattern(this.regexes['name']['regex'])]);
     this.form.controls['quentity']?.setValidators([Validators.required,Validators.pattern(this.regexes['quentity']['regex'])]);
    this.form.controls['purchasedate']?.setValidators([Validators.required]);
    this.form.controls['description']?.setValidators([Validators.pattern(this.regexes['description']['regex'])]);
    this.form.controls['warrenty']?.setValidators([Validators.required,Validators.pattern(this.regexes['warrenty']['regex'])]);
    this.form.controls['supplier']?.setValidators([Validators.required,Validators.pattern(this.regexes['description']['regex'])]);
    this.form.controls['supplieraddress']?.setValidators([Validators.required,Validators.pattern(this.regexes['supplieraddress']['regex'])]);
    this.form.controls['unitprice']?.setValidators([Validators.required,Validators.pattern(this.regexes['unitprice']['regex'])]);
    this.form.controls['lossitem']?.setValidators([Validators.pattern(this.regexes['lossitem']['regex'])]);
    this.form.controls['totalcost']?.setValidators([Validators.required]);
    this.form.controls['loss']?.setValidators([]);
    this.form.controls['itemstatus']?.setValidators([Validators.required]);
    this.form.controls['section']?.setValidators([]);
    this.form.controls['division']?.setValidators([]);
    this.form.controls['staffCreator']?.setValidators([Validators.required]);
    this.form.controls['itemcategory']?.setValidators([Validators.required]);

    Object.values(this.form.controls).forEach(control=>{control.markAsTouched();});

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];

      control.valueChanges.subscribe(value => {
        // @ts-ignore
        if(controlName=="purchasedate")
          value = this.dp.transform(new Date(value), 'yyyy-MM-dd');


        if (this.olditemObj != undefined && control.valid){
          // @ts-ignore
          if (value === this.itemObj[controlName]){ control.markAsPristine(); }
          else { control.markAsDirty(); }
        }
        else{ control.markAsPristine(); }
      });
    }
    this.enaleButtons(true, false, false,false);

  }

  //filter table
  filterTable(): void {

    const csearchdata = this.csearch.getRawValue();

    // @ts-ignore
    this.data.filterPredicate = (itm: Item, filter: string)=>{
      return(csearchdata.cscode==null||itm.itemcode.toLowerCase().includes(csearchdata.cscode))&&
        (csearchdata.csquentity==null||itm.quentity.toString().toLowerCase().includes(csearchdata.csquentity))&&
        (csearchdata.cssupplier==null||itm.supplier.toLowerCase().includes(csearchdata.cssupplier))&&
        (csearchdata.cswarranty==null||itm.warrenty.toLowerCase().includes(csearchdata.cswarranty));
    }
    this.data.filter="xx";
  }

  // Load the Main Table data
  loadTable(query:string){
    this.itemservice.getAll(query)
      .then((secs: Item[]) => {this.item=secs; this.imageurl='assets/fullfilled.png';})
      .catch((error) => {console.log(error); this.imageurl='assets/rejected.png';})
      .finally(()=> {this.data = new MatTableDataSource(this.item); this.data.paginator=this.paginator;});

  }

  createView() {
    this.imageurl='assets/pending.gif';
    this.loadTable("");
  }


  getModi(element: Item) {
      return element.totalcost+'.00';
  }

  // @ts-ignore
  getSection(element: Item){

    if (element.section != null){
      return element.section.name
    }else {
      return null;
    }
  }

  // @ts-ignore
  getDivision(element: Item){

    if (element.division != null){
      return element.division.name
    }else {
      return null
    }
  }

  ngOnInit(){
    this.initialize();
  }

  initialize() {

    this.createView();
    this.staffservice.getAllbyCallingname().then((full: Staff[]) =>{this.staffCreators = full;});
    this.itemcategoryservice.getAllList().then((categies: Itemcategory[]) =>{this.itemcategories = categies;});
    this.itemstatusservice.getAllList().then((statuses: Itemstatus[]) =>{this.itemstatuses = statuses;});
    this.sectionservice.getAll("").then((sections: Section[]) =>{this.sections = sections;});
    this.divisionservice.getAll("").then((div: Division[]) =>{this.divisions = div;});
    this.regexservice.get('item').then((regs: []) =>{
      this.regexes = regs;
      // console.log("R" + this.regexes['email']['regex']);
      this.createForm();
    });
  }

  //calculateTotalCost
  onKey(event: KeyboardEvent) {
    const quantity = this.form.controls['quentity'].value;
    const unitPrice = this.form.controls['unitprice'].value;

    const totalCost = quantity * unitPrice;

    this.form.controls['totalcost'].setValue(totalCost);
  }

  //findloss
  onKey2(event: KeyboardEvent) {
    const unitPrice = this.form.controls['unitprice'].value;
    const lossItem = this.form.controls['lossitem'].value;
    const Quantity = this.form.controls['quentity'].value;
    const totalcost = this.form.controls['totalcost'].value;

    if (lossItem != 0){
      const loss = unitPrice * lossItem;
      const lossCost = totalcost - loss;
      this.form.controls['loss'].setValue(lossCost);
    }else {
      this.form.controls['loss'].setValue(0);
    }


  }

  clearMainForm(){

    const today = new Date();
    console.log( today.toISOString())
    const formattedDate = today.toISOString().split("T")[0];

    this.form.controls['itemcode'].reset();
    this.form.controls['name'].reset();
    this.form.controls['quentity'].reset();
    this.form.controls['description'].reset();
    this.form.controls['warrenty'].reset();
    this.form.controls['supplier'].reset()
    this.form.controls['supplieraddress'].reset();
    this.form.controls['itemstatus'].reset();
    this.form.controls['section'].reset();
    this.form.controls['staffCreator'].reset();
    this.form.controls['itemcategory'].reset();
    this.form.controls['totalcost'].reset();
    this.form.controls['unitprice'].reset();
    this.form.controls['loss'].reset();
    this.form.controls['lossitem'].reset();
    this.form.controls['division'].reset();

    this.form.controls['purchasedate'].setValue(formattedDate);
  }

  //Server search form add button
  btnSearchMc() {

    const sserchdata = this.ssearch.getRawValue();

    let name = sserchdata.ssName;
    let statusid = sserchdata.ssStatus;
    let categoryid = sserchdata.ssCategory;


    let query = '';

    if (name != null && name.trim() != "") query+="&name="+name;
    if (statusid != null) query+="&statusid="+statusid;
    if (categoryid != null) query+="&categoryid="+categoryid;
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

  //Item Add method
  add(){
    let errors = this.getErrors();
    if(errors!=""){
      const errmsg = this.matDialog.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Item Add ", message: "You have following Errors <br> "+errors}
      });
      errmsg.afterClosed().subscribe(async result => { if (!result) { return; } });
    }
    else{
      this.itemObj = this.form.getRawValue();
      //console.log("Photo-Before"+this.item.photo);
      //console.log("Photo-After"+this.item.photo);
      let itemData: string = "";
      // itemData = itemData + "<br>Title is : "+ this.itemObj.title.name;
      // itemData = itemData + "<br>Fullname is : "+ this.itemObj.fullname;
      // itemData = itemData + "<br>Callingname is : "+ this.itemObj.callingname;
      const confirm = this.matDialog.open(ConfirmComponent, {
        width: '500px',
        data: {heading: "Confirmation - Item Add",
          message: "Are you sure to Add the folowing Item? <br> <br>"+ itemData}
      });
      let addstatus:boolean=false;
      let addmessage:string="Server Not Found";
      confirm.afterClosed().subscribe(async result => {
        if(result){
          // console.log("ItemService.add(emp)");
          // @ts-ignore
          this.itemservice.add(this.itemObj).then((responce: []|undefined) => {
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
              this.olditemObj = undefined;
              this.clearMainForm();
              this.loadTable("");
              Object.values(this.form.controls).forEach(control=>{control.markAsTouched();});
              this.enaleButtons(true,false,false,false);
            }
            const stsmsg = this.matDialog.open(MessageComponent, {
              width: '500px',
              data: {heading: "Status -Item Add", message: addmessage}
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
  fillForm(item: Item){

    this.form.controls['lossitem'].enable();


    this.enaleButtons(false,true,true,true);

    this.selectedRow=item;

    this.itemObj = JSON.parse(JSON.stringify(item));
    // console.log(this.itemObj)
    this.olditemObj = JSON.parse(JSON.stringify(item));


    // @ts-ignore
    this.itemObj.itemcategory = this.itemcategories.find(category=> category.id === this.itemObj.itemcategory.id);
    // @ts-ignore
    this.itemObj.itemstatus = this.itemstatuses.find(status=> status.id === this.itemObj.itemstatus.id);

    if (this.itemObj.section != null){
      // @ts-ignore
      this.itemObj.section = this.sections.find(sec=> sec.id === this.itemObj.section.id);
      // @ts-ignore
      this.itemObj.staffCreator = this.staffCreators.find(creator=> creator.id === this.itemObj.staffCreator.id);
      this.form.patchValue(this.itemObj);
      this.form.markAsPristine();
    }
    if (this.itemObj.section != null && this.itemObj.division != null){

      // @ts-ignore
      this.itemObj.section = this.sections.find(sec=> sec.id === this.itemObj.section.id);
      // @ts-ignore
      this.itemObj.division = this.divisions.find(div=>div.id === this.itemObj.division.id)
      // @ts-ignore
      this.itemObj.staffCreator = this.staffCreators.find(creator=> creator.id === this.itemObj.staffCreator.id);
      this.form.patchValue(this.itemObj);
      this.form.markAsPristine();
    }else {
      // @ts-ignore
      this.itemObj.division = this.divisions.find(div=>div.id === this.itemObj.division.id)
      // @ts-ignore
      this.itemObj.staffCreator = this.staffCreators.find(creator=> creator.id === this.itemObj.staffCreator.id);
      this.form.patchValue(this.itemObj);
      this.form.markAsPristine();
    }

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

  enaleButtons(add:boolean, upd:boolean, del:boolean,pri:boolean){
    this.enaadd = add;
    this.enaupd = upd;
    this.enadel = del;
    this.enprint = pri;
  }

  // Update function
  update() {
    let errors = this.getErrors();
    if (errors != "") {
      const errmsg = this.matDialog.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Item Update ", message: "You have following Errors <br> " + errors}
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
            this.itemObj = this.form.getRawValue();

            // @ts-ignore
            this.itemObj.id = this.olditemObj.id;
            this.itemservice.update(this.itemObj).then((responce: [] | undefined) => {
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
                this.olditemObj = undefined;
                this.clearMainForm();
                this.loadTable("");
                Object.values(this.form.controls).forEach(control=>{control.markAsTouched();});
                this.enaleButtons(true,false,false,false);
                this.form.controls['lossitem'].disable();

              }
              const stsmsg = this.matDialog.open(MessageComponent, {
                width: '500px',
                data: {heading: "Status -Item Update", message: updmessage}
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
        heading: "Confirmation - Item Delete",
        message: "Are you sure to Delete folowing Item Member? <br> <br>" +
          this.itemObj.name
      }
    });
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";
        // @ts-ignore
        this.itemservice.delete(this.itemObj.id).then((responce: [] | undefined) => {
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
            this.olditemObj = undefined;
            this.clearMainForm();
            this.loadTable("");
            Object.values(this.form.controls).forEach(control=>{control.markAsTouched();});
            this.enaleButtons(true,false,false,false);
            this.form.controls['lossitem'].disable();

          }
          const stsmsg = this.matDialog.open(MessageComponent, {
            width: '500px',
            data: {heading: "Status - Item Delete ", message: delmessage}
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
        this.olditemObj = undefined;
        this.clearMainForm();
        this.loadTable("");
        Object.values(this.form.controls).forEach(control=>{control.markAsTouched();});
        this.enaleButtons(true,false,false,false);
        this.form.controls['lossitem'].disable();

      }
    });
  }

  print() {
    const data = this.form.getRawValue();
    const printWindow = window.open('', '_blank');

    // Check if Section is present, if so, set Division to null
    if (data.section != null) {
      data.division = null;
    } else {
      data.section = null;
    }

    // @ts-ignore
    printWindow.document.open();
    // @ts-ignore
    printWindow.document.write(`
    <html>
      <head>
        <style>

         ul {
            list-style-type: disc;
            margin-left: 30px;
            font-size: 20px;
            line-height: 1.5; /* Increase the line height for better readability */
            }

            li {
            margin-bottom: 10px; /* Add some space between list items */
            }

            li b {
            display: inline-block;
            width: 150px; /* Adjust the width of the labels for better alignment */
            }

            h1 {
            text-align: center;
            font-size: 50px;
            margin-bottom: 30px; /* Add some space below the heading */
            }

            .tab {
            display: inline-block;
            width: 30px; /* Define a custom tab width */
            }
        </style>
      </head>
      <body>
        <h1>Zonal Office Akuressa</h1>
        <ul>
          <li><b>Item Code:</b> ${data.itemcode}</li>
          <li><b>Item Name:</b> ${data.name}</li>
          <li><b>Purchase Date:</b> ${data.purchasedate}</li>
          <li><b>Unit Price:</b> ${data.unitprice}</li>
          <li><b>Total Cost:</b> ${data.totalcost}</li>


          <!-- Display either Section or Division -->
          ${
      data.section
        ? `<li><b>Section:</b> ${data.section.name}</li>`
        : `<li><b>Division:</b> ${data.division.name}</li>`
    }
              ${
      data.lossitem
        ? ` <li><b>Lost Quantity:</b> ${data.lossitem}</li>`
        : `<li><b>Lost Quantity:</b> 0 </li>`
    }
              ${
      data.loss
        ? ` <li><b>Loss Cost:</b> ${data.loss}</li>`
        : `<li><b>Lost Cost:</b> 0 </li> `
    }


          <li><b>Supplier Name:</b> ${data.supplier}</li>
        </ul>
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

