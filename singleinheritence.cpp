#include<iostream>
using namespace std;
class person{
public:
string name;
int age;
float height;
bool adult;
person(string name, int age, float height)
{
    this->name=name;
    this->age=age;
    this->height=height;
    if(age>=18){
        adult=true;
    }
    else{
        adult=false;

    }
    }
};
class student : public person{
    public:
    int rollno;
    int grade;
    int cgpa;
    student(string name, int age, float height, int rollno, int grade, int cgpa): person(name,age,height){
        this->rollno=rollno;
        this->grade=grade;
        this->cgpa=cgpa;
    }

    
};
class gradstudent : public student{
    public:

    string researchsubject;
    gradstudent(string name, int age, float height, int rollno, int grade, int cgpa, string researchsubject): student(name,age,height,rollno,grade,cgpa){
        this->researchsubject=researchsubject;
    }
    void showinfo(){
        cout<<"Name: "<<name<<endl;
        cout<<"Age: "<<age<<endl;
        cout<<"Height: "<<height<<endl;
        cout<<"Adult: "<<adult<<endl;
        cout<<"Roll No: "<<rollno<<endl;
        cout<<"Grade: "<<grade<<endl;
        cout<<"CGPA: "<<cgpa<<endl;
        cout<<"Research Subject: " <<researchsubject<<endl;

    }

};
int main(){
    gradstudent s1("Shaheen Haris", 955, 45, 101, 12, 3.5, "Dev oops");
    s1.showinfo();
return 0;
};