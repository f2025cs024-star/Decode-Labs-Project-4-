#include<iostream>
using namespace std;
class result{
    public:
    string name;
    int rollno;
    int age;
    int s1marks;
    int s2marks;
    int s3marks;
    result(string name, int rollno, int age, int s1marks, int s2marks, int s3marks){
        this->name=name;
        this->rollno=rollno;
        this->age=age;
        this->s1marks=s1marks;
        this->s2marks=s2marks;
        this->s3marks=s3marks;
    };
    void print(){
        cout<< "result is as below: " << endl;
        cout << "1.Name: " << name << endl;
        cout << " 2.Roll no: "<< rollno << endl;

        cout << " 3.Age: " << age << endl;
        cout << " 4.Urdu: " << s1marks << endl;
        cout << " 5.English: " << s2marks <<endl;
        cout << " 6.Math: " << s3marks << endl;
    };
    float average(){
        return s1marks+s2marks+s3marks/3;
    };
};
int main() {
    result S1("Talha", 24, 19, 12, 18, 19);
    S1.print();
    cout << endl;
    cout <<"the average are: "<< S1.average() << endl;
}