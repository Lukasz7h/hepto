import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnInit
{

  constructor(
    private httpClient: HttpClient
  ){}

  title = 'company';
  view: Subject<number> = new Subject<number>();

  viewNumber: number = 1;
  canPerform: boolean = true;

  currentElement: HTMLImageElement | undefined;

  navLeft: string[] =
  window.innerWidth > 550?
    (window.innerWidth > 720?
      (window.innerWidth < 900 && window.innerHeight < 500)? ["12vw", "37vw", "63vw"]:
      (window.innerWidth < 1150 && window.innerHeight < 500)? ["9vw", "37vw", "63vw"]:["165px", "376px", "592px"]:
  ['8vw', '36vw', '66vw']):["6vw", "35vw", "66vw"];

  lastScrollTop: number = 0;
  st: any;

  @ViewChild("aboutUs") aboutUs: ElementRef | any;
  @ViewChild("workArea") workArea: ElementRef | any;
  @ViewChild("contact") contact: ElementRef | any;

  @ViewChild("info")
  infoElement: ElementRef | any;

  @ViewChild("current")
  currentEle: ElementRef | any;

  @ViewChild("styleToggle") styleElement: ElementRef | any;

  checkCookie()
  {
    this.httpClient.get("https://companyapi-production.up.railway.app/cookie", {withCredentials: true})
    .subscribe((e) => {});
  }

  ngOnInit(): void
  {
    this.checkCookie();
    const thatElements: HTMLElement | any = document.querySelectorAll('.list');
    
    Array.from(thatElements)
    .forEach((e: HTMLElement | any) => {
      e.classList.remove("active");
    });

    thatElements.item(this.viewNumber - 1).classList.add("active");

    const currentNav: HTMLElement | any = document.querySelector('.current');
    currentNav.style.left = this.navLeft[this.viewNumber - 1];
  }

  infoListener()
  {
    const that = this;
    function mousemoveEvent(e: Event | any)
    {
      if( !(e.target instanceof HTMLSpanElement) ){
        if(that.currentElement){
          that.currentElement.classList.remove("active");
          that.currentElement = undefined;
        };

        return;
      };

      const element: HTMLImageElement | any = Array.from(images)
      .find((element: HTMLElement | any) => {
        if(element.classList.contains(e.target.classList.item(1))) return element;
      });

      element?.classList.add("active");
      that.currentElement = element;
    }

    const images = document.getElementsByClassName("info");
    this.infoElement.nativeElement
    .addEventListener("mousemove", mousemoveEvent)
  }

  listenViewChanges(this: any)
  {
    this.currentEle.nativeElement.style.transition = "left .4s";
    const navList: HTMLCollectionOf<Element> = document.getElementsByClassName("list");

    const that = this;
    const elements: ElementRef[] = [this.aboutUs, this.workArea, this.contact];

    function scrollTo()
    {
      if(that.canPerform) return;

      elements[that.viewNumber - 1].nativeElement.scrollIntoView({behavior: "smooth", block: "end"});
      const top: number = that.viewNumber * window.innerHeight - window.innerHeight;

      if( !(window.scrollY + 37 > top) || !(window.scrollY - 37 < top)) return;

      setTimeout(() => {
        that.canPerform = true;
        document.removeEventListener("scroll", scrollTo)

        that.listener();
      }, 170);
      
    };

    let rateOfChanges: number = 1;
    let time: any; 

    this.view
    .subscribe(
      (e: number) => {

        document.querySelectorAll(".list")
        .forEach((el) => {
          el.classList.remove("active");
        })

        document.querySelectorAll(".view")
        .forEach((el: any, id) =>{
          id + 1 == e? 
          [
            el.style.display = "flex",
            document.querySelector(".current")['style'].left = `${that.navLeft[e-1]}`,
            document.getElementsByClassName("list").item(e-1).classList.add("active")
          ]:
          el.style.display = "none";
        })
        
      }
    );
  };

  listenerCities()
  {
    let flag: boolean = true;
    let currentCity: HTMLElement | any;

    const subject: Subject<boolean> = new Subject<boolean>();

    document.getElementById("work_area")
    ?.addEventListener("mousemove", (e: Event | any) => {

      if(!e.target.classList.contains("city") && !e.target.parentElement.classList.contains("city"))
      {
        subject.next(false);
        return;
      };

      currentCity = e.target.classList.contains("city")? e.target: e.target.parentElement;
      subject.next(true);
    });

    function action(e: boolean)
    {
      if(currentCity) var paragraph = currentCity.getElementsByTagName("p").item(0);

      function write()
      {
        const data = currentCity.getAttribute("data-city");
        if(!flag) return;

        flag = false;

        currentCity.classList.add("touch");
        currentCity.getElementsByTagName("img").item(0).classList.add("display");

        const icon: HTMLElement | any = document.getElementsByClassName(`icon-${data}`).item(0);
        icon.classList.add("underline");

        for(let i=0; i<data.length; i++)
        {
          setTimeout(() => {
            if(!e) return;
            if(i==0) paragraph.textContent = "";

            if(data[i-1] == paragraph.textContent[i-1]) paragraph.textContent += data[i];
          }, 400 + i * 60);
        }
      };

      function removeWord()
      {

        currentCity.classList.remove("touch");

        currentCity.getElementsByTagName("img").item(0).classList.remove("display");
        const data = currentCity.getAttribute("data-city");

        const icon: HTMLElement | any = document.getElementsByClassName(`icon-${data}`).item(0);
        icon.classList.remove("underline");

        for(let i=0; i<paragraph.textContent.length; i++)
        {
          setTimeout(() => {
            paragraph.textContent = paragraph.textContent.slice(0, -1);
          }, 300 + i * 40);
        }

        flag = true;
      };

      if(!paragraph) return;
      e? write(): removeWord()
    };
    
    subject.subscribe(action);
  }

  sendEmail(form: NgForm)
  {
    const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(!form.value.email.match(mailformat) && form.value.message.length < 7) return;

    this.httpClient.post("https://companyapi-production.up.railway.app/email", form.value)
    .subscribe((e) => {
      
    });
  }

  changeStyle()
  {
    let flag: boolean = true;

    const body: HTMLElement | any = document.getElementsByTagName("body").item(0);
    const info: HTMLElement | any = document.getElementById("info");

    const nav: HTMLElement | any = document.getElementsByTagName("nav").item(0);
    const mapTitle: HTMLElement | any = document.getElementById("title");

    const cities: HTMLElement | any = document.getElementsByClassName("city");

    this.styleElement.nativeElement.addEventListener("click", () => {

      flag = !flag;

      function night()
      {
        document.querySelectorAll(".view")
        .forEach((el: any) => {
          el.style.backgroundColor = "#303030";
        });

        document.getElementById("general_data").querySelector("h3").style.color = "#fff";

        info.style.color = "#fff";
        body.style.backgroundColor = 'rgb(48, 48, 48)';

        nav.classList.add("night");
        mapTitle.style.color = "whitesmoke";

        Array.from(cities)
        .forEach((e: HTMLElement | any) => {
          e.style.color = "#5dcab5"
        });
      };
      
      function day()
      {
        document.querySelectorAll(".view")
        .forEach((el: any) => {
          el.style.backgroundColor = "#fff";
        });
        document.getElementById("general_data").querySelector("h3").style.color = "#000";

        info.style.color = "black";
        body.style.backgroundColor = "#fff";

        nav.classList.remove("night");
        mapTitle.style.color = "#5a5a5a";

        Array.from(cities)
        .forEach((e: HTMLElement | any) => {
          e.style.color = "black"
        });
      };

      flag? day(): night();
    });
  }

  ngAfterViewInit(): void
  {
    this.changeStyle();

    Array.from(document.getElementsByClassName("show_img"))
    .forEach((e: HTMLElement | any) => {
      setTimeout(() => {
        e.classList.remove("show_img");
        e.style.opacity = "1";
      }, 1850);
      
    });

    this.infoListener();
    this.listenerCities();

    this.listenViewChanges();

    this.st = window.pageYOffset || document.documentElement.scrollTop;
  }

}