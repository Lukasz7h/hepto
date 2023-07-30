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
  navLeft: string[] = window.innerWidth > 550?
  (window.innerWidth > 720? ["165px", "376px", "592px"] : ['8vw', '36vw', '66vw']):
  ["3vw", "35vw", "69vw"];

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
    this.httpClient.get("http://localhost:3000/cookie", {withCredentials: true})
    .subscribe((e) => {});
  }

  ngOnInit(): void
  {
    this.checkCookie();

    window.onbeforeunload = () => {
      window.localStorage.setItem("viewNumber", this.viewNumber.toString());
    };

    this.viewNumber = Number(window.localStorage.getItem("viewNumber")) | 0;

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
    };
     
    this.view
    .subscribe(
      (e: number) => {

        if(!that.canPerform) return;

        if(e < 1) e = 1;
        if(e > 3) e = 3;

        this.viewNumber = e;
        this.canPerform = false;

        Array.from(navList)
        .forEach((e) => {
          e.classList.remove("active");
        });

        navList.item(e-1)?.classList.add("active");
        this.currentEle.nativeElement.style.left = this.navLeft[this.viewNumber - 1];

        scrollTo();
        document.addEventListener("scroll", scrollTo);

        setTimeout(() => {
          that.canPerform = true;
          document.removeEventListener("scroll", scrollTo)

          that.listener();
        }, 850);
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

    this.httpClient.post("http://localhost:3000/email", form.value)
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
        body.style.backgroundColor = "#303030";
        info.style.color = "#fff";

        nav.classList.add("night");
        mapTitle.style.color = "whitesmoke";

        Array.from(cities)
        .forEach((e: HTMLElement | any) => {
          e.style.color = "#5dcab5"
        });
      };
      
      function day()
      {
        body.style.backgroundColor = "#fff";
        info.style.color = "black";

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
    this.listener();

    this.st = window.pageYOffset || document.documentElement.scrollTop;
  }

  listener()
  {
    const that = this;
    let counter = 0;

    function call()
    {
      var st = document.documentElement.scrollTop || document.body.scrollTop;
      if(!counter) that.lastScrollTop = st;

      counter++;
      if(counter < 3) return;

      document.removeEventListener("scroll", call);

      if(st > that.lastScrollTop)
      {
        that.view.next(that.viewNumber+1);
      }
      else if (st < that.lastScrollTop) {
        that.view.next(that.viewNumber-1);
      }
      
    };
    
    document.addEventListener("scroll", call);
  }

}