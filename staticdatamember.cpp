#include<iostream>
using namespace std;
class student{
    string studentname;
    int rollno;
    string course;
    int batch;
    static int count;
    public:
    student(string studentname, int rollno, string course, int batch){
        this->studentname=studentname;
        this->rollno=rollno;
        this->course=course;
        this->batch=batch;
        count++;
    };
    void show(){
        cout << "the name of student is: "<<studentname<<" and the roll number is: "<<rollno<<" and the course is: "<<course<<" and the batch is: "<<batch<<endl;
    };
    static void showcount(){
        cout << "the number of students is: "<<count<<endl;

    };
   

};
int student::count=0;
int main(){
    student s1("talha",24,"BSCS",2025);
    student s2("Ali",22,"BSCS",2025);
    student s3("Noman",06,"BSSE",2025);
    student s4("Shaheer",25,"BSCS",2025);
    s1.show();
    s2.show();
    s3.show();
    s4.show();
    student::showcount();
    return 0;



};
