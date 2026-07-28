#include<iostream>
using namespace std;
class Quiz{
    string student_name;
    string student_id;
    int marks;
    int age;
    float percentage;
    char grade;
    public:
    void updateage(int age){
        if(age>0 && age<100){
            this->age=age;
        } else{
            cout<<"Invalid age. Age cannot be updated."<<endl;
        };
    };
        void updatemarks(int marks){
            if (marks>=0 &&marks<=100){
                this->marks=marks;
            } else{
                cout<<"Invalid marks. Marks cannot be updated."<<endl;
            };
        };
    
    Quiz(string stdent_name,string student_id,int marks,int age){
        this->student_name=stdent_name;
        this->student_id=student_id;
        this->marks=marks;
        this->age=age;
            if(percentage>=90){
                grade='A';
            } else if(percentage>=80){
                grade='B';
            } else if(percentage>=70){
                grade='C';
            } else if(percentage>=60){
                grade='D';
            } else{
                grade='F';
            };
        percentage=(marks/100.0)*100;
};
void printdetails(){
    cout<<"Student Name: "<<student_name<<endl;
    cout<<"Student ID: "<<student_id<<endl;
    cout<<"Marks: "<<marks<<endl;
    cout<<"Age: "<<age<<endl;
    cout<<"Percentage: "<<percentage<<"%"<<endl;
    cout<<"Grade: "<<grade<<endl;
};
};
int main(){
    Quiz Q1("Talha","F2025CS24",78,19);
    Quiz Q2("Ali","F2025CS022",92,19);
    Q1.updateage(20);
    Q2.updatemarks(85);
    Q1.printdetails();
    Q2.printdetails();
    return 0;
}

