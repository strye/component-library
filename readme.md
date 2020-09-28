# component-library

This project contains several web components that can be used to build a website using vanila js without the need for heavy opinionated frameworks. 

## Goal
Modern web development shouldn't need overly complicated web frameworks that simulate native web components and lock you into thier design patterns. There are also lightweight web component libraries that facilitate building native javascript web sights by obfascating the details of web components. The benfit of these lightweight libraries over frameworks, is that they are usabe both standalone and in heavy framworks.

While philosophicly alighed with the lighter component libraries, the goal here is to provide raw web components for you to learn and build upon. You're encuraged to explore and modify the code provided to build truly custom web components. Understanding how components work makes you a better developer, and I belive a good foundation here will convince you that heavy frameworks have actually slowed you down and complicated your development efforts. At the very least you have build foundational knowledge that is transferable to any library or framework.

## A note on project structure
Normally you would find each web-component split into it's own project to faclitate more modular reuse. While at some point this project may grow in size and be split out that way to facilitate deployments through tools like NPM, for now this remains a resource library and may be considered as more like boilerplate code to ge you started.

To that end there are a few items to note regarding how files are broken out.

### Style sheets
Component styles have been separated out into separate css files. The one style exception being the styling of the root element, which has been kept purposfully light. Normally the styles would be included directly into the componet files themselves; however, I wanted to make it easy to expirament with styling components and component families. If you decide to integrate the styles back into the comonents it is a simple matter of replacing the import statement with the content fo the cscs file. There is one other practicle reason that these have been separated out, and it's a holdover to my agency days when I worked with wed designers. Having the css files separate from the code files allowed for separateion of duties. Those lines and role distinctions are blurrier these days but thought it worth mentioning.


