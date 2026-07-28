#include<iostream>
using namespace std;
class student{
    protected:
    int roll_number;
    float CGPA;
    public:
    void attendlectures(){
        cout<<"Hello I can attend lectures"<<endl;
    };
};
class teacher{
    protected:
    int employee_id;
    string subject;
    public:
    void labsessions(){
        cout<<"Hello I can conduct lab sessions: "<<subject<<endl;
    };
};
class teachingassistant:public student, public teacher{
    string name;
    public:
    void eligibility(){
        if (CGPA>3.0){
            cout<<"I am eligible to be a teaching assistant"<<endl;
        }
        else{
            cout<<"I am not eligible to be a teaching assistant"<<endl;
        }
    };
    teachingassistant(string name, int roll_number, float CGPA, int employee_id, string subject){
        this->name=name;
        this->roll_number=roll_number;
        this->CGPA=CGPA;
        this->employee_id=employee_id;
        this->subject=subject;
    };
    void display(){
        cout<<"Name: "<<name<<endl;
        cout<<"Roll Number: "<<roll_number<<endl;
        cout<<"CGPA: "<<CGPA<<endl;
        cout<<"Employee ID: "<<employee_id<<endl;
        cout<<"Subject: "<<subject<<endl;
        attendlectures();
        labsessions();
        eligibility();
    }
};
int main(){
    teachingassistant t1("Talha", 24, 3.2, 65, "Machine learning");
    t1.display();
    return 0;
};