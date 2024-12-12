import { Log } from '@microsoft/sp-core-library';
import { override } from '@microsoft/decorators';
import {
  BaseFieldCustomizer,
  IFieldCustomizerCellEventParameters
} from '@microsoft/sp-listview-extensibility';

import * as strings from 'TermStoreFieldCustomizerFieldCustomizerStrings';
import styles from './TermStoreFieldCustomizerFieldCustomizer.module.scss';

import { sp } from '@pnp/sp';

import {  stringToColour, fontColorFromBackground } from './utils/color';

//import "@pnp/sp/webs";
//import "@pnp/sp/lists"
//import { TaxonomyFieldValue } from '@pnp/sp/taxonomy';

/**
 * If your field customizer uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface ITermStoreFieldCustomizerFieldCustomizerProperties {
  // This is an example; replace with your own property
  sampleText?: string;
}

const LOG_SOURCE: string = 'TermStoreFieldCustomizerFieldCustomizer';

export default class TermStoreFieldCustomizerFieldCustomizer
  extends BaseFieldCustomizer<ITermStoreFieldCustomizerFieldCustomizerProperties> {

  @override
  public onInit(): Promise<void> {
    // Add your custom initialization to this method.  The framework will wait
    // for the returned promise to resolve before firing any BaseFieldCustomizer events.
    Log.info(LOG_SOURCE, 'Activated TermStoreFieldCustomizerFieldCustomizer with properties:');
    Log.info(LOG_SOURCE, JSON.stringify(this.properties, undefined, 2));
    Log.info(LOG_SOURCE, `The following string should be equal: "TermStoreFieldCustomizerFieldCustomizer" and "${strings.Title}"`);

    //Initialize pnpjs to intercat with SharePoint
        //return Promise.resolve();

        sp.setup({
          spfxContext: this.context
        });

        console.log("spfxContext: this.contxt is", this.context)

        return super.onInit();


  }

  @override
  public  onRenderCell(event: IFieldCustomizerCellEventParameters): void {
    // Use this method to perform your custom cell rendering.


    console.log('onRenderCell event.fieldValue is',event.fieldValue);

    let terms : string[];

    if (event.fieldValue) {


      terms = event.fieldValue.reduce((accumulator,currentValue) => {

        console.log('currentValue.Label has color',stringToColour(currentValue.Label));
        console.log('currentValue.Label has background color',fontColorFromBackground(stringToColour(currentValue.Label)))

      //  let itemToAdd: string = "<h4 className=" + styles.badge + ">" + currentValue + "</h4>"

      //  return accumulator+'; '+currentValue.Label

      accumulator.push(currentValue.Label);

      return accumulator;


      },[]);


    }

    console.log('terms is ',terms);
    


    const text: string = `${this.properties.sampleText}: ${event.fieldValue}`;

    let badges: string = "";

    const rootElement: HTMLDivElement = document.createElement('div');
    rootElement.className = styles.TermStoreFieldCustomizer;


    //Generate badges
    terms.forEach((item: string, index: number) => {

      let bgColor: string = stringToColour(item);
      let fontColor: string = fontColorFromBackground(bgColor);

     // badges += "<span class='"+styles.badge+"' style='background-color:"+bgColor+"; color:"+fontColor+"'>"+item+"</span>"
    // badges += `<span class="${styles.TermStoreFieldCustomizer} ${styles.badge}" style="background-color:${bgColor}; color:${fontColor}">${item}</span>`

    const spanElement: HTMLSpanElement = document.createElement('span');
    spanElement.className = styles.badge;
    spanElement.style.backgroundColor = bgColor;
    spanElement.style.color = fontColor;

    if (index > 0)
      spanElement.style.marginLeft = "10px";
    
    spanElement.innerText = item;

    rootElement.appendChild(spanElement);



   // event.domElement.appendChild(spanElement);



    })

    event.domElement.appendChild(rootElement);



    /*   event.domElement.innerHTML = badges;   */
    //event.domElement.innerText = "Captured terms are "+terms;

  //  console.log('rendered cell is '+event.domElement.innerText);


    /*  event.domElement.classList.add(styles.cell);  */

    //did not error out
   // const list = sp.web.lists.getByTitle("Documents");
    const list = sp.web.lists.getByTitle("Documents").select('Title').get().then((titles) => {

      console.log('title are',titles);
      

    });


    const targetList = sp.web.lists.getByTitle("FieldCustomizerTermStore").items.get().then((items) => {

      console.log('items are',items);


    });
    

    
    console.log("list is ",list);


  }

  @override
  public onDisposeCell(event: IFieldCustomizerCellEventParameters): void {
    // This method should be used to free any resources that were allocated during rendering.
    // For example, if your onRenderCell() called ReactDOM.render(), then you should
    // call ReactDOM.unmountComponentAtNode() here.
    super.onDisposeCell(event);
  }
}
