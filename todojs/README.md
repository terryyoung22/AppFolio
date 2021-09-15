# nodejs-todo

<h2> A simple To Do List application built with Node.js and Express</h2>

<p> Nodejs application that let's you add and complete task on a single page, storing both new and completed task in a different array. This appllication makes use of: </p>

<ul>
<li> EJS - A simple templating engine that lets you generate HTML markup with plain JS </li>

<li> Body-parser - This extracts the entire body portion of an incoming request stream and exposes it on req.body </li>
</ul>

<br>

<p> How to run the app: </p>

<ol>
<li>With Container:</li>
<li> Run <code> docker built -t IMAGENAME . </code> to install create the container image. You can leave out the <code>IMAGENAME</code> if you want. </li>

<li> Then run the contianer using <code> docker run -dit --name CONTAINERNAME -p 3000 IMAGENAMEHERE </code> </li>

<li> Navigate to your browser <code> http://localhost:3000/ </code> to view the app </li>
</ol>

<ol>
<li>Run Locally:</li>
<li> Run <code> npm install </code> to install all needed dependencies </li>

<li> Then start the server using <code> node index.js </code> </li>

<li> Navigate to your browser <code> http://localhost:3000/ </code> to view the app </li>
</ol>
