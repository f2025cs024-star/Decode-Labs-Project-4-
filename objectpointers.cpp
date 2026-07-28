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

};
void change(result* S){
    (*S).s3marks=21;
};
int main() {
    result S1("Talha", 24, 19, 12, 18, 19);
    change(&S1);
    cout << S1.s3marks << endl;
   
   

  
}