let video;
let poseNet;
let ready = false;
let poses = [];
let noses = [];
let leftEyes = [];
let rightEyes = [];
let leftEars = [];
let rightEars = [];
let leftShoulders = [];
let rightShoulders = [];
let leftElbows = [];
let rightElbows = [];
let leftWrists = [];
let rightWrists = [];
let leftHips = [];
let rightHips = [];
let leftKnees = [];
let rightKnees = [];
let leftAnkles = [];
let rightAnkles = [];
let heights = [];
let rightArmIncs = [];
let leftArmIncs = [];
let font;
let alphaVal = 100;
let npeople = 0;
let pnpeople = -1;
let theta;
let nBranches = 0;
let nLayers = 4;
let maxNBranches = 7;
let thickness = 100;
let fruitColor;
let angle = [];
let bottomOffsets = [];
let dryBranchesRot = [];
let dryBranchesRotCount = 0;
let buddingBranchesRot = [];
let buddingBranchesRotCount = 0;
let radFruits = [];
let radFruitsCount;
let randBranch1 = [];
let randBranch2 = [];
let randBranch3 = [];
let randBranch4 = [];
let randBranch5 = [];
let randBranch6 = [];
let cores = [];
let treepick = [];
let randWidthOffset = [];
let randBranchCount = 0;
let count = 0;
let curPerson = 0;

function preload() {
  font = loadFont("data/Junge-Regular.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.size(width, height);
  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on("pose", function (results) {
    poses = results;
  });
  video.hide();
  fruitColor = color("#c7a842")
  fruitColor.setAlpha(alphaVal);
  rectMode(CENTER);
  textFont(font);
  textAlign(CENTER, CENTER);
  textSize(25);
  noStroke();
}

function modelReady() {
  ready = true;
  select("#status").html("Model Loaded");
}

function draw() {
  background("#D6CAA1");
  if (ready == false) {
    fill("#392c23");
    text("Loading...", width / 2, height / 2);
  } else {

    defineVars();
    curPerson = 0;
    dryBranchesRotCount = 0;
    radFruitsCount = 0;
    buddingBranchesRotCount = 0;
    randBranchCount = 0;

    if (pnpeople < npeople) {
      for (let i = pnpeople; i < npeople; i++) {
        angle[i] = random(10, 30); //"ABERTURA" DA ÁRVORE
        bottomOffsets[i] = random(-width * 0.024, width * 0.024);
        randWidthOffset[i] = random(-35,35);

        if (random(1) > 0.5) {
          cores[i] = color("#76a137");
          cores[i].setAlpha(alphaVal);
        }
        else {
          cores[i] = color("#3784a1");
          cores[i].setAlpha(alphaVal);
        }
        if (random(1) > 0.5)
          treepick[i] = 1;
        else
          treepick[i] = 2;
      }
      for (let i = nLayers * nLayers * thickness * thickness * pnpeople; i < nLayers * nLayers * thickness * thickness * npeople; i++) {
        dryBranchesRot[i] = random(-1, 1);
        buddingBranchesRot[i] = random(-1, 1);
        radFruits[i] = random(2,8);
        randBranch1[i] = random(-1, 1);
        randBranch2[i] = random(-1, 1);
        randBranch3[i] = random(6);
        randBranch4[i] = random(0, 5);
        randBranch5[i] = random(-1, 1);
        randBranch6[i] = random(2);
      }
      pnpeople = npeople;
    }
    for (let i = 0; i < npeople; i++) {
      let hr = map(heights[i],height/4,height,height/8,height/3);
      fill(cores[i],200);
      if (treepick[i] == 1)
        drawDeadTree(width/2+randWidthOffset[i], height * 0.9, angle[i], hr, bottomOffsets[i]);
      else
        drawBuddingTree(width/2+randWidthOffset[i], height * 0.9, angle[i], hr, bottomOffsets[i]);
      curPerson++;
    }
    
    image(video, width/4*3, height/4*3, width/4, height/4);
    /*drawKeypoints();
    drawSkeleton();*/
  }
}

function defineVars() {
  npeople = 0;
  for (let i = 0; i < poses.length; i++) {
    if (poses[i].skeleton.length > 4) {
      npeople++;
      noses[i] = poses[i].pose.keypoints[0].position;
      leftEyes[i] = poses[i].pose.keypoints[1].position;
      rightEyes[i] = poses[i].pose.keypoints[2].position;
      leftEars[i] = poses[i].pose.keypoints[3].position;
      rightEars[i] = poses[i].pose.keypoints[4].position;
      leftShoulders[i] = poses[i].pose.keypoints[5].position;
      rightShoulders[i] = poses[i].pose.keypoints[6].position;
      leftElbows[i] = poses[i].pose.keypoints[7].position;
      rightElbows[i] = poses[i].pose.keypoints[8].position;
      leftWrists[i] = poses[i].pose.keypoints[9].position;
      rightWrists[i] = poses[i].pose.keypoints[10].position;
      leftHips[i] = poses[i].pose.keypoints[11].position;
      rightHips[i] = poses[i].pose.keypoints[12].position;
      leftKnees[i] = poses[i].pose.keypoints[13].position;
      rightKnees[i] = poses[i].pose.keypoints[14].position;
      leftAnkles[i] = poses[i].pose.keypoints[15].position;
      rightAnkles[i] = poses[i].pose.keypoints[16].position;
      heights[i] = leftAnkles[i].y - noses[i].y;
      rightArmIncs[i] = map(rightWrists[i].y,height,0,1,-1);
      leftArmIncs[i] = map(leftWrists[i].y,height,0,1,-1);
      angle[i] = map(dist(leftWrists[i].x,leftWrists[i].y,rightWrists[i].x,rightWrists[i].y),0,width/2,0,30);
  }}
}

function drawDeadTree(x_, y_, angle_, length_, bottomOffset_) {
  for (let i = 0; i < nLayers; i++) {
    nBranches = 0;
    push();
    theta = radians(angle_);
    translate(x_, y_);
    for (let j = 0; j <= i; j++)
      drawLine(bottomOffset_ * (1 + 0.2 * (j + i)),0,0,-length_, 60, 9 - j - i);
    translate(0, -length_ * (1 - i * 0.2));
    dryBranch(length_);
    pop();
  }
}

function dryBranch(h) {
  nBranches++;
  h *= 0.68;
  if (nBranches < maxNBranches) {
    for (let i = 0; i < nLayers / 2; i++) {
      push();
      let na;
      if (dryBranchesRot[dryBranchesRotCount] > 0)
        na = dryBranchesRot[dryBranchesRotCount] + rightArmIncs[curPerson];
      else 
        na = dryBranchesRot[dryBranchesRotCount] - leftArmIncs[curPerson];
      rotate(theta * na);
      drawLine(0, 0, 0, -h, thickness - nBranches * 5, 6 - nBranches);
      translate(0, -h);
      dryBranch(h);
      pop();
      dryBranchesRotCount++;
    }
  }
}

function drawBuddingTree(x_, y_, angle_, length_, bottomOffset_) {
  for (let i = 0; i < nLayers; i++) {
    nBranches = 0;
    push();
    theta = radians(angle_);
    translate(x_, y_);
    for (let j = 0; j <= i; j++)
      drawLine(bottomOffset_ * (1 + 0.2 * (j + i)), 0, 0, -length_, 60, 9 - j - i);
    translate(0, -length_ * (1 - i * 0.2));
    buddingBranch(length_);
    pop();
  }
}

function buddingBranch(h) {
  nBranches++;
  h *= 0.68;
  if (nBranches < maxNBranches) {
    for (let i = 0; i < nLayers / 2; i++) {
      push();
      let na;
      if (dryBranchesRot[dryBranchesRotCount] > 0)
        na = buddingBranchesRot[buddingBranchesRotCount] + rightArmIncs[curPerson];
      else 
        na = buddingBranchesRot[buddingBranchesRotCount] - leftArmIncs[curPerson];
      rotate(theta * na);
      drawLine(0, 0, 0, -h, thickness - nBranches * 5, 6 - nBranches);
      translate(0, -h);
      buddingBranch(h);
      pop();
      buddingBranchesRotCount++;
    }
  }
  if (h <= 285) {
    push();
    fill(fruitColor);
    circle(0, 0, radFruits[radFruitsCount]*1.5);
    pop();
    radFruitsCount++;
  }
}

function drawLine(x1_, y1_, x2_, y2_, numOfPoints_, radius_) {
  this.num = numOfPoints_;
  this.x1 = x1_;
  this.y1 = y1_;
  this.x2 = x2_;
  this.y2 = y2_;
  this.r = radius_;

  push();
  let v1 = createVector(this.x1, this.y1);
  let v2 = createVector((this.x2 - this.x1) / this.num, (this.y2 - this.y1) / this.num);
  circle(v1.x + randBranch1[randBranchCount], v1.y + randBranch2[randBranchCount], this.r + randBranch3[randBranchCount]);
  for (let i = 0; i < this.num; i++) {
    v1.add(v2.x, v2.y);
    circle(v1.x + sin(radians(i * 3)) * randBranch4[randBranchCount], v1.y + randBranch5[randBranchCount], this.r + randBranch6[randBranchCount]);
    randBranchCount++;
  }
  pop();
  randBranchCount++;
}